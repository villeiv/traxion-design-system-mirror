import { SortableBoard } from "@traxion-global/design-system";
import {SortableBoardSizing} from "./sources/SortableBoard.sizing";
import SortableBoardRenderItem from "./sources/SortableBoard.renderItem.tsx";
import SortableBoardRenderItemRaw from "./sources/SortableBoard.renderItem.tsx?raw";
import ToasterDecorator from "./decorators/ToasterDecorator";
import SortableBoardOnChange from "./sources/SortableBoardOnChange.tsx";
import SortableBoardOnChangeRaw from "./sources/SortableBoardOnChange.tsx?raw";

export default {
    title: 'SortableBoard',
    component: SortableBoard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        a11y: {disable: true},
        actions: {disable: true},
        controls: {disable: true},
        docs: {
            description: {
                component: '**SortableBoard** es un componente que permite crear tableros con columnas y elementos que se pueden arrastrar y soltar entre ellas. Este componente solo se puede utilizar de manera no controlada, es decir, el estado de las columnas y tareas se maneja internamente y se puede escuchar mediante el callback *onChange*.' + SortableBoardSizing
            },
            story: {
                inline: false,
                height: '600px',
            },
        }
    },
    argTypes: {
        defaultColumns: {
            description: 'Propiedad para definir las columnas y sus elementos de manera inicial. Cada columna debe tener un título *title* y una lista de elementos *items*.',
        },
        onChange: {
            description: 'Callback que se ejecuta cuando se produce un cambio en las columnas o elementos del tablero. Recibe como parámetro el nuevo estado de las columnas.',
        },
        renderItem: {
            description: 'Función opcional para personalizar la renderización de los elementos dentro de las columnas. Recibe el item como parámetro y debe retornar un componente React.'
        }
    }
}

export const Basic = {
    name: 'Uso básico',
    args: {
        defaultColumns: [
            {
                title: 'Para hacer',
                items: ['Tarea 1', 'Tarea 2', 'Tarea 3'],
            },
            {
                title: 'En progreso',
                items: ['Tarea 4', 'Tarea 5'],
            },
            {
                title: 'Terminado',
                items: ['tarea 6'],
            }
        ]
    },
    render: (args) =>
        <div className={"overflow-hidden overflow-x-auto sm:overflow-x-hidden"}>
            <div className={"w-[750px] sm:w-[900px] h-[500px]"}>
                <SortableBoard {...args} />
            </div>
        </div>
}

export const CustomItemRender = {
    name: 'Renderizado personalizado de elementos',
    parameters: {
        docs: {
            description: {
                story: 'En este ejemplo se muestra cómo personalizar el renderizado de los elementos dentro de las columnas utilizando la prop *renderItem*.'
            },
            source: {
                code: SortableBoardRenderItemRaw
            }
        }
    },
    render: SortableBoardRenderItem
}

export const ReactingToChanges = {
    name: 'Reaccionando a cambios',
    decorators: [ToasterDecorator],
    parameters: {
        docs: {
            description: {
                story: 'Este ejemplo muestra cómo utilizar el callback *onChange* para reaccionar a los cambios en las columnas o elementos del tablero. Cada vez que se produce un cambio, se lanza un toast y se imprime en la consola el estado de columnas e items.'
            },
            source:{
                code: SortableBoardOnChangeRaw
            }
        }
    },
    render: SortableBoardOnChange
}