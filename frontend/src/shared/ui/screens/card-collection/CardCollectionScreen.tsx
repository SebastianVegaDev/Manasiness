import "./CardCollectionScreen.css"

import LoadingOverlay from "@shared/ui/modal/LoadingOverlay"
import PageTitle from "@shared/ui/titles/page/PageTitle"
import CardCollectionGrid from "./CardCollectionGrid"
import CardCollectionToolbar from "./CardCollectionToolbar"

import type { CollectionFilterGroup } from "@shared/types/collection.types"
import type { EntityId } from "@shared/types/common.types"

export type CardCollectionItem = {
    id: EntityId
    name: string
    image: string
    status?: string
    details?: string[]
}

type CardCollectionScreenProps = {
    title: string
    subtitle?: string
    items: CardCollectionItem[]
    searchLabel: string
    resourcePath: string
    onCreateClick?: () => void
    searchValue: string
    onSearchChange: (event: { target: { value: string } }) => void
    filterGroups?: CollectionFilterGroup[]
    resultsCount?: number
    emptyMessage?: string
    isLoading?: boolean
}

function CardCollectionScreen({
    title,
    subtitle,
    items,
    searchLabel,
    resourcePath,
    onCreateClick,
    searchValue,
    onSearchChange,
    filterGroups = [],
    resultsCount = 0,
    emptyMessage,
    isLoading = false
}: CardCollectionScreenProps) {
    return (
        <div className="shared-card-layout">
            <PageTitle title={title} subtitle={subtitle} />
            <CardCollectionToolbar
                searchLabel={searchLabel}
                onCreateClick={onCreateClick}
                searchValue={searchValue}
                onSearchChange={onSearchChange}
                filterGroups={filterGroups}
                resultsCount={resultsCount}
            />
            <CardCollectionGrid
                items={items}
                resourcePath={resourcePath}
                emptyMessage={emptyMessage}
            />
            {isLoading ? <LoadingOverlay /> : null}
        </div>
    )
}

export default CardCollectionScreen
