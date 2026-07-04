import "./PaginationControls.css"

import { StepBack, StepForward } from "lucide-react"

type PaginationControlsProps = {
    page?: number
    currentPage?: number
    totalPage?: number
    onPrevPage?: (() => void) | undefined
    onNextPage?: (() => void) | undefined
    className?: string
}

function PaginationControls({
    page,
    currentPage,
    totalPage = 1,
    onPrevPage,
    onNextPage,
    className = "shared-table-actions"
}: PaginationControlsProps) {
    const safePage = Math.max(Number(page ?? currentPage ?? 1) || 1, 1)
    const safeTotalPage = Math.max(Number(totalPage) || 1, 1)

    return (
        <div className={className}>
            <button type="button" onClick={onPrevPage} disabled={safePage <= 1 || !onPrevPage}><StepBack /></button>
            <p>Page {safePage} of {safeTotalPage}</p>
            <button type="button" onClick={onNextPage} disabled={safePage >= safeTotalPage || !onNextPage}><StepForward /></button>
        </div>
    )
}

export default PaginationControls
