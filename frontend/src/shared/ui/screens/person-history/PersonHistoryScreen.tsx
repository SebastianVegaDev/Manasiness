import "./PersonHistoryScreen.css"

import LoadingOverlay from "@shared/ui/modal/LoadingOverlay"
import PaginationControls from "@shared/ui/navigation/PaginationControls"
import PersonTitle from "@shared/ui/titles/person/PersonTitle"
import PersonHistoryTable from "./PersonHistoryTable"
import PersonHistoryToolbar from "./PersonHistoryToolbar"

import type { PersonHistoryScreenProps } from "@shared/types/personHistory.types"

function PersonHistoryScreen({
    title,
    name,
    rows,
    columns,
    sectionTitle,
    sortValue,
    onSortChange,
    windowLabel = "",
    hasOlder = false,
    hasNewer = false,
    onOlder,
    onNewer,
    currentPage,
    totalPage,
    onPrevPage,
    onNextPage,
    isLoading = false,
    emptyMessage = "No records found"
}: PersonHistoryScreenProps) {
    return (
        <div className="shared-person-layout">
            <PersonTitle title={title} name={name} sectionTitle={sectionTitle} />
            <PersonHistoryToolbar sortValue={sortValue} onSortChange={onSortChange} windowLabel={windowLabel} hasOlder={hasOlder} hasNewer={hasNewer} onOlder={onOlder} onNewer={onNewer} />
            <PersonHistoryTable rows={rows} columns={columns} emptyMessage={emptyMessage} />
            <PaginationControls page={currentPage} totalPage={totalPage} onPrevPage={onPrevPage} onNextPage={onNextPage} className="shared-person-actions" />
            {isLoading ? <LoadingOverlay /> : null}
        </div>
    )
}

export default PersonHistoryScreen
