import { CATALOG_COLLECTION_CONFIG } from "@features/catalog/shared/config/catalogCollections.config"
import { useCollectionPage } from "@shared/hooks/useCollectionPage"
import CardCollectionScreen from "@shared/ui/screens/card-collection/CardCollectionScreen"
import ProductCreateModal from "@features/catalog/products/components/ProductCreateModal"

function ProductsPage() {
    const config = CATALOG_COLLECTION_CONFIG.products
    const collection = useCollectionPage(config)

    return (
        <>
            <CardCollectionScreen
                title={config.title}
                subtitle={config.subtitle}
                items={collection.items}
                searchLabel={config.searchLabel}
                resourcePath={config.resourcePath}
                onCreateClick={collection.openCreateModal}
                searchValue={collection.searchInput}
                onSearchChange={collection.handleSearchChange}
                filterGroups={collection.filterGroups}
                resultsCount={collection.resultsCount}
                emptyMessage={config.emptyMessage}
                isLoading={collection.isLoading}
            />

            {collection.isCreateModalOpen ? (
                <ProductCreateModal
                    onClose={collection.closeCreateModal}
                    onCreate={collection.handleCreate}
                />
            ) : null}
        </>
    )
}

export default ProductsPage

