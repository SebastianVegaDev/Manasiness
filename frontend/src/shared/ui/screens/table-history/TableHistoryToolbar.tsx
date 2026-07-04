import "./TableHistoryToolbar.css"

import { Plus, StepBack, StepForward } from "lucide-react"

import type { TableHistorySortChangeEvent } from "@shared/types/tableHistory.types"

type TableHistoryToolbarProps = {
    sortValue: string
    onSortChange: (event: TableHistorySortChangeEvent) => void
    windowLabel?: string
    hasOlder?: boolean
    hasNewer?: boolean
    onOlder?: (() => void) | undefined
    onNewer?: (() => void) | undefined
    onRegisterClick?: (() => void) | undefined
}

function TableHistoryToolbar({
    sortValue,
    onSortChange,
    windowLabel = "",
    hasOlder = false,
    hasNewer = false,
    onOlder,
    onNewer,
    onRegisterClick
}: TableHistoryToolbarProps) {
    return (
        <div className="shared-table-toolbar">
            <div className="shared-table-filter-switch">
                <input checked={sortValue === "recent"} onChange={onSortChange} id="shared-table-filter-recent" name="table-history-filter" type="radio" value="recent" />
                <label className="shared-table-filter-option" htmlFor="shared-table-filter-recent">Recent</label>
                <input checked={sortValue === "oldest"} onChange={onSortChange} id="shared-table-filter-oldest" name="table-history-filter" type="radio" value="oldest" />
                <label className="shared-table-filter-option" htmlFor="shared-table-filter-oldest">Oldest</label>
                <span className="shared-table-filter-background" />
            </div>

            <div className="shared-table-window">
                <button type="button" onClick={onOlder} disabled={!hasOlder || !onOlder}><StepBack /></button>
                <p>{windowLabel || "No range available"}</p>
                <button type="button" onClick={onNewer} disabled={!hasNewer || !onNewer}><StepForward /></button>
            </div>

            {onRegisterClick ? (
                <div className="table-button-register">
                    <button type="button" onClick={onRegisterClick}><Plus />Register</button>
                </div>
            ) : null}
        </div>
    )
}

export default TableHistoryToolbar
