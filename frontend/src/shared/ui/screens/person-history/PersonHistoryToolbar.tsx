import "./PersonHistoryToolbar.css"

import { StepBack, StepForward } from "lucide-react"

import type { PersonHistorySortChangeEvent } from "@shared/types/personHistory.types"

type PersonHistoryToolbarProps = {
    sortValue: string
    onSortChange: (event: PersonHistorySortChangeEvent) => void
    windowLabel?: string
    hasOlder?: boolean
    hasNewer?: boolean
    onOlder?: (() => void) | undefined
    onNewer?: (() => void) | undefined
}

function PersonHistoryToolbar({ sortValue, onSortChange, windowLabel = "", hasOlder = false, hasNewer = false, onOlder, onNewer }: PersonHistoryToolbarProps) {
    return (
        <div className="shared-person-toolbar">
            <div className="shared-person-history-filter">
                <input checked={sortValue === "recent"} onChange={onSortChange} id="shared-person-history-filter-recent" name="person-history-filter" type="radio" value="recent" />
                <label className="shared-person-history-filter-option" htmlFor="shared-person-history-filter-recent">Recent</label>
                <input checked={sortValue === "oldest"} onChange={onSortChange} id="shared-person-history-filter-oldest" name="person-history-filter" type="radio" value="oldest" />
                <label className="shared-person-history-filter-option" htmlFor="shared-person-history-filter-oldest">Oldest</label>
                <span className="shared-person-history-filter-background" />
            </div>
            <div className="shared-person-history-window">
                <button type="button" onClick={onOlder} disabled={!hasOlder || !onOlder}><StepBack /></button>
                <p>{windowLabel || "No range available"}</p>
                <button type="button" onClick={onNewer} disabled={!hasNewer || !onNewer}><StepForward /></button>
            </div>
        </div>
    )
}

export default PersonHistoryToolbar
