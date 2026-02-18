"use client"

import * as React from "react"
import { useCallback, useEffect, useState, useTransition } from "react"
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  ColumnOrderState,
} from "@tanstack/react-table"

/**
 * Configuration options for useDataTable hook
 */
export interface UseDataTableOptions {
  /**
   * Initial page size
   * @default 10
   */
  pageSize?: number

  /**
   * Enable server-side data fetching (required for DataTable component)
   * When true, pagination/sorting/filtering changes will update the URL
   * @default false
   */
  serverSide?: boolean

  /**
   * Namespace prefix for URL params (for multiple tables on same page)
   * Example: "shipments" → ?shipments_page=1&shipments_filters=...
   * @default undefined (no prefix)
   */
  namespace?: string

  /**
   * Debounce delay for filter changes (in milliseconds)
   * @default 300
   */
  debounceMs?: number

  /**
   * Next.js router instance (for client-side navigation)
   * If not provided, hook will attempt to use Next.js useRouter
   */
  router?: {
    push: (url: string) => void
  }

  /**
   * Next.js searchParams (for reading URL state)
   * If not provided, hook will attempt to use Next.js useSearchParams
   */
  searchParams?: URLSearchParams | null
}

/**
 * Return type for useDataTable hook
 */
export interface UseDataTableReturn {
  // Pagination state
  pagination: PaginationState
  setPagination: (
    updater: PaginationState | ((old: PaginationState) => PaginationState)
  ) => void

  // Sorting state
  sorting: SortingState
  setSorting: (
    updater: SortingState | ((old: SortingState) => SortingState)
  ) => void

  // Column filters state
  columnFilters: ColumnFiltersState
  setColumnFilters: (
    updater:
      | ColumnFiltersState
      | ((old: ColumnFiltersState) => ColumnFiltersState)
  ) => void

  // Column visibility state
  columnVisibility: VisibilityState
  setColumnVisibility: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void

  // Column order state
  columnOrder: ColumnOrderState
  setColumnOrder: (
    updater: ColumnOrderState | ((old: ColumnOrderState) => ColumnOrderState)
  ) => void

  // Helper to get search params for API calls
  getSearchParams: () => URLSearchParams
}

/**
 * Parse URL search params into table state
 */
function parseSearchParams(searchParams: URLSearchParams | null, namespace?: string) {
  if (!searchParams) {
    return {
      page: 0,
      pageSize: 10,
      sorting: [] as SortingState,
      columnFilters: [] as ColumnFiltersState,
    }
  }

  // Add namespace prefix if provided
  const getParam = (key: string) => {
    return namespace ? searchParams.get(`${namespace}_${key}`) : searchParams.get(key)
  }

  const page = Number(getParam("page")) || 1
  const pageSize = Number(getParam("pageSize")) || 10

  // Parse sorting: format is "columnId.asc" or "columnId.desc"
  const sortParam = getParam("sort")
  const sorting: SortingState = sortParam
    ? sortParam.split(",").map((sort) => {
        const [id, desc] = sort.split(".")
        return { id, desc: desc === "desc" }
      })
    : []

  // Parse filters: format is "columnId:value,columnId2:value2"
  const filtersParam = getParam("filters")
  const columnFilters: ColumnFiltersState = filtersParam
    ? filtersParam.split(",").map((filter) => {
        const [id, value] = filter.split(":")
        return { id, value }
      })
    : []

  return {
    page: page - 1, // TanStack Table uses 0-based indexing
    pageSize,
    sorting,
    columnFilters,
  }
}

/**
 * Serialize table state into URL search params
 */
function serializeSearchParams(
  pagination: PaginationState,
  sorting: SortingState,
  columnFilters: ColumnFiltersState,
  namespace?: string,
  currentParams?: URLSearchParams | null
): URLSearchParams {
  // Start with existing params to preserve other tables' state
  const params = new URLSearchParams(currentParams || undefined)

  // Add namespace prefix if provided
  const setParam = (key: string, value: string) => {
    const paramKey = namespace ? `${namespace}_${key}` : key
    params.set(paramKey, value)
  }

  const deleteParam = (key: string) => {
    const paramKey = namespace ? `${namespace}_${key}` : key
    params.delete(paramKey)
  }

  // Add pagination
  setParam("page", String(pagination.pageIndex + 1)) // Convert to 1-based
  setParam("pageSize", String(pagination.pageSize))

  // Add sorting
  if (sorting.length > 0) {
    const sortString = sorting
      .map((sort) => `${sort.id}.${sort.desc ? "desc" : "asc"}`)
      .join(",")
    setParam("sort", sortString)
  } else {
    deleteParam("sort")
  }

  // Add filters
  if (columnFilters.length > 0) {
    const filtersString = columnFilters
      .map((filter) => `${filter.id}:${filter.value}`)
      .join(",")
    setParam("filters", filtersString)
  } else {
    deleteParam("filters")
  }

  return params
}

/**
 * Hook for managing DataTable state with URL synchronization
 *
 * **Important**: The DataTable component is server-side only. Always use `serverSide: true`
 * to enable URL synchronization and proper state management for server-side data fetching.
 *
 * Works with Next.js App Router for server-side pagination/sorting/filtering.
 *
 * @example
 * ```tsx
 * const tableState = useDataTable({
 *   serverSide: true,  // Required for DataTable
 *   pageSize: 10
 * })
 *
 * // Use tableState to fetch data from your API
 * const { data, pageCount } = await fetchData({
 *   page: tableState.pagination.pageIndex,
 *   pageSize: tableState.pagination.pageSize,
 *   sort: tableState.sorting,
 *   filters: tableState.columnFilters,
 * })
 * ```
 */
export function useDataTable(
  options: UseDataTableOptions = {}
): UseDataTableReturn {
  const {
    pageSize: initialPageSize = 10,
    serverSide = false,
    namespace,
    debounceMs = 300,
    router: customRouter,
    searchParams: customSearchParams,
  } = options

  // Use provided router and searchParams
  const router = customRouter
  const searchParams = customSearchParams ?? null

  // Parse initial state from URL
  const initialState = parseSearchParams(searchParams ?? null, namespace)

  // Table state
  const [pagination, setPaginationState] = useState<PaginationState>({
    pageIndex: initialState.page,
    pageSize: initialState.pageSize || initialPageSize,
  })

  const [sorting, setSortingState] = useState<SortingState>(
    initialState.sorting
  )

  const [columnFilters, setColumnFiltersState] = useState<ColumnFiltersState>(
    initialState.columnFilters
  )

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])

  // Track if we're updating the URL
  const [isPending, startTransition] = useTransition()

  // Track if initial render is complete
  const isInitialRender = React.useRef(true)

  // Mark initial render as complete after mount
  React.useEffect(() => {
    isInitialRender.current = false
  }, [])

  /**
   * Sync all state to URL (after initial render)
   * Note: Debouncing should be handled at the component level for filters
   * using useDebouncedCallback to avoid laggy inputs
   */
  React.useEffect(() => {
    // Skip URL update during initial render
    if (isInitialRender.current || !serverSide || !router) return

    const params = serializeSearchParams(
      pagination,
      sorting,
      columnFilters,
      namespace,
      searchParams
    )

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }, [pagination, sorting, columnFilters, serverSide, router, namespace])

  /**
   * Pagination setter (no URL sync here - handled by useEffect)
   */
  const setPagination = useCallback(
    (
      updater: PaginationState | ((old: PaginationState) => PaginationState)
    ) => {
      setPaginationState(updater)
    },
    []
  )

  /**
   * Sorting setter (no URL sync here - handled by useEffect)
   */
  const setSorting = useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      setSortingState(updater)
    },
    []
  )

  /**
   * Column filters setter (immediate update, URL sync is debounced in useEffect)
   */
  const setColumnFilters = useCallback(
    (
      updater:
        | ColumnFiltersState
        | ((old: ColumnFiltersState) => ColumnFiltersState)
    ) => {
      setColumnFiltersState(updater)
    },
    []
  )

  /**
   * Helper to get search params for API calls
   */
  const getSearchParams = useCallback((): URLSearchParams => {
    return serializeSearchParams(pagination, sorting, columnFilters, namespace)
  }, [pagination, sorting, columnFilters, namespace])

  return {
    pagination,
    setPagination,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    columnOrder,
    setColumnOrder,
    getSearchParams,
  }
}
