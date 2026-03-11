import { DataTable } from "@traxion-global/design-system/react";
import { DataTableAnatomy } from "./sources/DataTable.anatomy";
import { UseDataTableHookDocs } from "./sources/DataTable.useDataTableHook";
import DataTableBasic from "./sources/DataTable.basic";
import DataTableBasicCode from "./sources/DataTable.basic?raw";
import DataTableSortable from "./sources/DataTable.sortable";
import DataTableSortableCode from "./sources/DataTable.sortable?raw";
import DataTableToggle from "./sources/DataTable.toggle";
import DataTableToggleCode from "./sources/DataTable.toggle?raw";
import DataTableActionBtns from "./sources/DataTable.actions";
import DataTableActionBtnsCode from "./sources/DataTable.actions?raw";
import DataTableMixedCellContent from "./sources/DataTable.mixed";
import DataTableMixedCellContentCode from "./sources/DataTable.mixed?raw";
import DataTableRowSelection from "./sources/DataTable.selection";
import DataTableRowSelectionCode from "./sources/DataTable.selection?raw";
import DataTableRearrangeColumns from "./sources/DataTable.rearrange";
import DataTableRRearrangeColumnsCode from "./sources/DataTable.rearrange?raw";
import DataTableLoading from "./sources/DataTable.loading";
import DataTableLoadingCode from "./sources/DataTable.loading?raw";
import DataTableFiltering from "./sources/DataTable.filtering";
import DataTableFilteringCode from "./sources/DataTable.filtering?raw";
import DataTableAllFunctionality from "./sources/DataTable.allFunctionality";
import DataTableAllFunctionalityCode from "./sources/DataTable.allFunctionality?raw";

export default {
    title: "DataTable",
    component: DataTable,
    tags: ["autodocs"],
    parameters: {
        a11y: { disable: true },
        controls: { disable: true },
        actions: { disable: true },
        docs: {
            description: {
                component:
                    "Un componente de tabla potente y con funcionalidades avanzadas, construido sobre TanStack Table con soporte " +
                    "integrado para ordenamiento, filtrado, paginación, visibilidad de columnas y reordenamiento. " +
                    "\n\n**Recomendación de uso:** Este componente está diseñado para tablas de datos complejas que requieren funcionalidades avanzadas. " +
                    "Si necesitas una tabla más simple para mostrar datos estáticos o con poca interactividad, considera usar el componente **Table** en su lugar. " +
                    DataTableAnatomy +
                    UseDataTableHookDocs,
            },
        },
    },
};

export const Basic = {
    name: "Uso básico",
    render: DataTableBasic,
    parameters: {
        docs: {
            source: { code: DataTableBasicCode },
            description: {
                story: "Ejemplo básico usando **DataTable** con datos de usuarios obtenidos de una API. " +
                    "La tabla muestra paginación y se actualiza al cambiar de página o tamaño de página."
            },
        },
    },
};

export const Loading = {
    name: "Estado de carga",
    render: DataTableLoading,
    parameters: {
        docs: {
            source: { code: DataTableLoadingCode },
            description: {
                story: "Ejemplo de **DataTable** mostrando el estado de carga. En este estado, la tabla muestra un skeleton en lugar de los datos."
            },
        },
    },
};

export const Sortable = {
    name: "Columnas ordenables",
    render: DataTableSortable,
    parameters: {
        docs: {
            source: { code: DataTableSortableCode },
            description: {
                story: "Ejemplo de **DataTable** con columnas ordenables. Haz clic en los encabezados de las columnas para ordenar los datos ascendente o descendentemente. " +
                    "El estado de ordenamiento se mantiene al cambiar de página o tamaño de página.",
            },
        },
    },
};

export const ToggleColumns = {
    name: "Visibilidad de columnas",
    render: DataTableToggle,
    parameters: {
        docs: {
            source: { code: DataTableToggleCode },
            description: {
                story: "Ejemplo de **DataTable** con funcionalidad de visibilidad de columnas. Usa el menú de configuración para mostrar u ocultar columnas según tus necesidades. "
            },
        },
    },
}

export const ActionButtons = {
    name: "Botones de acción",
    render: DataTableActionBtns,
    parameters: {
        docs: {
            source: { code: DataTableActionBtnsCode },
            description: {
                story: "Ejemplo de **DataTable** con botones de acción en cada fila. Estos botones permiten realizar acciones específicas para cada usuario, como editar o eliminar."
            },
        },
    },
}

export const MixedCellContent = {
    name: "Contenido mixto en celdas",
    render: DataTableMixedCellContent,
    parameters: {
        docs: {
            source: { code: DataTableMixedCellContentCode },
            description: {
                story: "Ejemplo de **DataTable** con contenido mixto en las celdas. Este ejemplo muestra cómo renderizar"+
                " diferentes tipos de contenido, como texto, íconos o texto con estilos diferentes combinando varios datos del mismo usuario."
            },
        },
    },
}

export const RowSelection = {
    name: "Selección de filas",
    render: DataTableRowSelection,
    parameters: {
        docs: {
            source: { code: DataTableRowSelectionCode },
            description: {
                story: "Ejemplo de **DataTable** con selección de filas y **DataTableSelectionBar**. " +
                "Muestra cómo seleccionar filas y presentar acciones masivas (eliminar, exportar) en una barra fija en la parte inferior de la página. " +
                "La selección persiste entre páginas y el botón Deselect limpia toda la selección."
            },
        },
    },
}

export const RearrangeColumns = {
    name: "Reordenar columnas",
    render: DataTableRearrangeColumns,
    parameters: {
        docs: {
            source: { code: DataTableRRearrangeColumnsCode },
            description: {
                story: "Ejemplo de **DataTable** con funcionalidad de reordenamiento de columnas. Este ejemplo muestra cómo permitir a los usuarios"+
                " arrastrar y soltar los encabezados de las columnas para cambiar su orden dentro de la tabla."
            },
        },
    },
}

export const Filtering = {
    name: "Filtrado de datos",
    render: DataTableFiltering,
    parameters: {
        docs: {
            source: { code: DataTableFilteringCode },
            description: {
                story: "Ejemplo de **DataTable** con funcionalidad de filtrado de datos. Este ejemplo muestra cómo permitir a los usuarios"+
                " filtrar los datos en la tabla según diferentes criterios."
            },
        },
    },
}

export const AllFunctionality = {
    name: "Todas las funcionalidades",
    render: DataTableAllFunctionality,
    parameters: {
        docs: {
            source: { code: DataTableAllFunctionalityCode },
            description: {
                story: "Ejemplo completo de **DataTable** combinando todas las funcionalidades disponibles: " +
                    "selección de filas con checkboxes y acción masiva, ordenamiento por columnas, botones de acción con variantes " +
                    "(editar/eliminar), filtrado con búsqueda debounced, visibilidad de columnas configurada dentro del " +
                    "toolbar, reordenamiento de columnas mediante drag-and-drop, estado de carga con skeleton y " +
                    "paginación del lado del servidor.\n\n" +
                    "**Nota sobre contenido mixto:** La columna 'Ubicación' utiliza contenido mixto (múltiples líneas de texto) " +
                    "porque combina información relacionada (ciudad, estado, país) que es útil tener visible pero no justifica " +
                    "crear columnas separadas. Usa este patrón cuando la información sea un 'nice-to-have' que no amerita " +
                    "su propia columna, manteniendo así una tabla más compacta y fácil de escanear."
            }
        }
    }
}