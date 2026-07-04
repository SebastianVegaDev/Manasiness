import "./SortSwitch.css"

import type { TableHistorySortChangeEvent } from "@shared/types/tableHistory.types"

type SortSwitchProps = {
    value: string
    onChange: (event: TableHistorySortChangeEvent) => void
    className?: string
    label?: string
}

function SortSwitch({
    value,
    onChange,
    className = "shared-sort-switch",
    label = "Sort"
}: SortSwitchProps) {
    return (
        <label className={className}>
            <span>{label}</span>

            <select value={value} onChange={onChange}>
                <option value="recent">Recent</option>
                <option value="oldest">Oldest</option>
            </select>
        </label>
    )
}

export default SortSwitch
