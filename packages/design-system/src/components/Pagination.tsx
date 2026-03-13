import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { useDesignSystemLanguage } from "./Language-provider"
import { ButtonProps, buttonVariants } from "./Button"

const PAGINATION_TEXTS = {
  en: {
    navigation: "pagination",
    previousPage: "Go to previous page",
    nextPage: "Go to next page",
    morePages: "More pages",
  },
  es: {
    navigation: "paginación",
    previousPage: "Ir a la página anterior",
    nextPage: "Ir a la siguiente página",
    morePages: "Más páginas",
  },
} as const

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => {
  const language = useDesignSystemLanguage()
  const t = PAGINATION_TEXTS[language]
  return (
    <nav
      role="navigation"
      aria-label={t.navigation}
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("cursor-pointer", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn("select-none",
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const language = useDesignSystemLanguage()
  const t = PAGINATION_TEXTS[language]
  return (
    <PaginationLink
      aria-label={t.previousPage}
      size={props.children ? "sm" : "icon"}
      className={cn("gap-1", className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      {props.children && <span>{props.children}</span>}
    </PaginationLink>
  )
}
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const language = useDesignSystemLanguage()
  const t = PAGINATION_TEXTS[language]
  return (
    <PaginationLink
      aria-label={t.nextPage}
      size={props.children ? "sm" : "icon"}
      className={cn("gap-1", className)}
      {...props}
    >
      {props.children && <span>{props.children}</span>}
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  )
}
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => {
  const language = useDesignSystemLanguage()
  const t = PAGINATION_TEXTS[language]
  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">{t.morePages}</span>
    </span>
  )
}
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
