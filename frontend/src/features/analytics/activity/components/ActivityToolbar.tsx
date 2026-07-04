import "./ActivityToolbar.css"

import SelectFilterGroups from "@shared/ui/controls/SelectFilterGroups"
import WindowNavigator from "@shared/ui/navigation/WindowNavigator"

import type {
    ActivityChangeEvent,
    ActivityPeriod
} from "../shared/types/activity.types"
import type { CollectionFilterGroup } from "@shared/types/collection.types"
import type { SelectOption } from "@shared/types/form.types"

type ActivityToolbarProps = {
    windowLabel: string
    period: ActivityPeriod
    periodOptions: SelectOption[]
    onPeriodChange: (event: ActivityChangeEvent) => void
    hasOlder: boolean
    hasNewer: boolean
    onOlder: () => void
    onNewer: () => void
}

function ActivityToolbar({
    windowLabel,
    period,
    periodOptions,
    onPeriodChange,
    hasOlder,
    hasNewer,
    onOlder,
    onNewer
}: ActivityToolbarProps) {
    const filterGroups: CollectionFilterGroup[] = [
        {
            key: "activity-date-filter",
            label: "Range",
            value: period,
            onChange: onPeriodChange as CollectionFilterGroup["onChange"],
            options: periodOptions
        }
    ]

    return (
        <div className="activity-content-toolbar">
            <div className="activity-content-toolbar-side">
                <SelectFilterGroups
                    filterGroups={filterGroups}
                    className="activity-toolbar-filters"
                    itemClassName="activity-toolbar-filter"
                />
            </div>

            <div className="activity-content-toolbar-center">
                <WindowNavigator
                    label={windowLabel}
                    emptyLabel="No range available"
                    hasPrevious={hasOlder}
                    hasNext={hasNewer}
                    onPrevious={onOlder}
                    onNext={onNewer}
                    className="activity-window"
                />
            </div>

            <div className="activity-content-toolbar-side" />
        </div>
    )
}

export default ActivityToolbar
