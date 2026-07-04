import { PEOPLE_COLLECTION_CONFIG } from "@features/people/shared/config/peopleCollections.config"
import { useCollectionPage } from "@shared/hooks/useCollectionPage"
import CardCollectionScreen from "@shared/ui/screens/card-collection/CardCollectionScreen"

function CustomersPage() {
    const config = PEOPLE_COLLECTION_CONFIG.customers
    const collection = useCollectionPage(config)

    return (
        <CardCollectionScreen
            title={config.title}
            subtitle={config.subtitle}
            items={collection.items}
            searchLabel={config.searchLabel}
            resourcePath={config.resourcePath}
            searchValue={collection.searchInput}
            onSearchChange={collection.handleSearchChange}
            filterGroups={collection.filterGroups}
            resultsCount={collection.resultsCount}
            emptyMessage={config.emptyMessage}
            isLoading={collection.isLoading}
        />
    )
}

export default CustomersPage

