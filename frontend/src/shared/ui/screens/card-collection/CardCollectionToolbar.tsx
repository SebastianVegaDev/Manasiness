import "./CardCollectionToolbar.css"

import { Plus } from "lucide-react"

import SearchInput from "@shared/ui/controls/SearchInput"
import SelectFilterGroups from "@shared/ui/controls/SelectFilterGroups"

import type { CollectionFilterGroup } from "@shared/types/collection.types"

type CardCollectionToolbarProps = {
    searchLabel: string
    onCreateClick?: (() => void) | undefined
    searchValue: string
    onSearchChange: (event: { target: { value: string } }) => void
    filterGroups?: CollectionFilterGroup[]
    resultsCount?: number
}

function CardCollectionToolbar({
    searchLabel,
    onCreateClick,
    searchValue,
    onSearchChange,
    filterGroups = [],
    resultsCount = 0
}: CardCollectionToolbarProps) {
    return (
        <div className="shared-card-toolbar">
            <div className="shared-card-toolbar-main">
                <SearchInput
                    label={`Search ${searchLabel}`}
                    placeholder={`Search ${searchLabel}`}
                    value={searchValue}
                    onChange={onSearchChange}
                    formClassName="shared-card-search-form"
                    labelClassName="shared-card-search-label"
                    barClassName="shared-card-searchbar"
                    iconClassName="shared-card-search-icon"
                    inputClassName="shared-card-search-input"
                    inputId="shared-card-search-input"
                    inputName="card-search-query"
                />
                <SelectFilterGroups
                    filterGroups={filterGroups}
                    className="shared-card-toolbar-filters"
                    itemClassName="shared-card-toolbar-filter"
                />
            </div>
            <div className="shared-card-toolbar-actions">
                <p className="shared-card-toolbar-results">Results: {resultsCount}</p>
                {onCreateClick ? (
                    <div className="shared-card-button">
                        <button type="button" onClick={onCreateClick}>
                            <Plus />Create
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default CardCollectionToolbar
