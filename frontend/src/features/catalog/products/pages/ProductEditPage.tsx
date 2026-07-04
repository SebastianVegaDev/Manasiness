import { CATALOG_EDITOR_CONFIG } from "@features/catalog/shared/config/catalogEditors.config"
import { useEntityEditorPage } from "@shared/hooks/useEntityEditorPage"
import EntityEditorScreen from "@shared/ui/screens/entity-editor/EntityEditorScreen"

function ProductEditPage() {
    const config = CATALOG_EDITOR_CONFIG.product
    const editor = useEntityEditorPage(config)

    return (
        <EntityEditorScreen
            title={config.title}
            subtitle={config.subtitle}
            fields={editor.fields}
            values={editor.values}
            onSubmit={editor.handleSubmit}
            onCancel={editor.handleCancel}
            isLoading={editor.isLoading}
            isSubmitting={editor.isSubmitting}
            emptyMessage={config.emptyMessage}
        />
    )
}

export default ProductEditPage

