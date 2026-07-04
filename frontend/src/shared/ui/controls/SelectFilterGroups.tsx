import "./SelectFilterGroups.css"

import type { CollectionFilterGroup } from "@shared/types/collection.types"

type SelectFilterGroupsProps = {
    filterGroups?: CollectionFilterGroup[] | undefined
    className?: string | undefined
    itemClassName?: string | undefined
}

function SelectFilterGroups({
    filterGroups = [],
    className = "shared-select-filter-groups",
    itemClassName = "shared-select-filter"
}: SelectFilterGroupsProps) {
    const safeFilterGroups = Array.isArray(filterGroups) ? filterGroups : []

    if (!safeFilterGroups.length) {
        return null
    }

    return (
        <div className={className}>
            {safeFilterGroups.map((group) => (
                <label className={itemClassName} key={group.key}>
                    <span>{group.label}</span>

                    <select value={group.value} onChange={group.onChange}>
                        {group.options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            ))}
        </div>
    )
}

export default SelectFilterGroups
