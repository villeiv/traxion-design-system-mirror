import {Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from "@traxion-global/design-system";
import PaginationHandlers from "./sources/Pagination.handlers";
import PaginationHandlersCode from "./sources/Pagination.handlers?raw";
import {PaginationAnatomy} from "./sources/Pagination.anatomy";

export default {
    title: 'Pagination',
    component: Pagination,
    tags: ['autodocs'],
    parameters: {
        actions: { disable: true },
        a11y: { disable: true },
        controls: { disable: true },
        docs: {
            description: {
                component: 'Componente de paginación para navegar entre páginas de contenido.' + PaginationAnatomy
            }
        }
    }
}

export const Basic = {
    name: 'Uso básico',
    parameters: {
        docs: {
            description: {
                story: 'Ejemplo básico de paginación con enlaces a páginas y botones de navegación.'
            }
        }
    },
    render:args=>{
        return <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" isActive={true}>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#"><PaginationEllipsis /></PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href="#" />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    }
}

export const WithClickHandlers = {
    name: 'Con manejadores de clic',
    parameters: {
        docs: {
            description: {
                story: 'Ejemplo de paginación con manejadores de clic para cambiar la página actual.'
            },
            source: {
                code: PaginationHandlersCode
            }
        }
    },
    render:PaginationHandlers
}