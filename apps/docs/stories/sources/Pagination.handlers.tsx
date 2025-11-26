import {useState} from "react";
import {Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from "@traxion-global/design-system";

export default function PaginationHandlers(){
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3;

    function goToPage(page) {
        setCurrentPage(page);
    }

    function handleClick(page, event) {
        event.preventDefault();
        if (!isNaN(page)) {
            goToPage(page);
        }
    }

    return <Pagination>
        <PaginationContent>
            <PaginationItem>
                <PaginationPrevious onClick={e=>handleClick(currentPage===1? totalPages:currentPage-1, e)}>Anterior</PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink isActive={currentPage===1} onClick={e=>handleClick(1,e)}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink isActive={currentPage===2} onClick={e=>handleClick(2,e)}>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink isActive={currentPage===3} onClick={e=>handleClick(3,e)}>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationNext onClick={e=>handleClick(currentPage===totalPages? 1: currentPage+1, e)}>Siguiente</PaginationNext>
            </PaginationItem>
        </PaginationContent>
    </Pagination>
}