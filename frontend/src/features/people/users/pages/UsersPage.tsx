import { PEOPLE_COLLECTION_CONFIG } from "@features/people/shared/config/peopleCollections.config"
import { useCollectionPage } from "@shared/hooks/useCollectionPage"
import CardCollectionScreen from "@shared/ui/screens/card-collection/CardCollectionScreen"
import UserCreateModal from "@features/people/users/components/UserCreateModal"

function UsersPage() {
    const config = PEOPLE_COLLECTION_CONFIG.users
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
                <UserCreateModal
                    onClose={collection.closeCreateModal}
                    onCreate={collection.handleCreate}
                />
            ) : null}
        </>
    )
}

export default UsersPage

