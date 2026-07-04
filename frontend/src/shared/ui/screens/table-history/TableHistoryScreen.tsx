import "./TableHistoryScreen.css"

import LoadingOverlay from "@shared/ui/modal/LoadingOverlay"
import PageTitle from "@shared/ui/titles/page/PageTitle"
import PaginationControls from "@shared/ui/navigation/PaginationControls"
import DataTable from "./DataTable"
import TableHistoryToolbar from "./TableHistoryToolbar"

import type { TableHistoryScreenProps } from "@shared/types/tableHistory.types"

function TableHistoryScreen({
    title,
    subtitle,
    rows,
    columns = [],
    sortValue,
    onSortChange,
    windowLabel = "",
    hasOlder = false,
    hasNewer = false,
    onOlder,
    onNewer,
    page = 1,
    totalPage = 1,
    onPrevPage,
    onNextPage,
    onRegisterClick,
    emptyMessage = "No records found",
    isLoading = false
}: TableHistoryScreenProps) {
    return (
        <div className="shared-table-layout">
            <PageTitle title={title} subtitle={subtitle} />
            <TableHistoryToolbar
                sortValue={sortValue}
                onSortChange={onSortChange}
                windowLabel={windowLabel}
                hasOlder={hasOlder}
                hasNewer={hasNewer}
                onOlder={onOlder}
                onNewer={onNewer}
                onRegisterClick={onRegisterClick}
            />
            <DataTable rows={rows} columns={columns} emptyMessage={emptyMessage} />
            <PaginationControls page={page} totalPage={totalPage} onPrevPage={onPrevPage} onNextPage={onNextPage} />
            {isLoading ? <LoadingOverlay /> : null}
        </div>
    )
}

export default TableHistoryScreen
