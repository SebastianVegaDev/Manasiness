import { PEOPLE_EDITOR_CONFIG } from "@features/people/shared/config/peopleEditors.config"
import { useEntityEditorPage } from "@shared/hooks/useEntityEditorPage"
import EntityEditorScreen from "@shared/ui/screens/entity-editor/EntityEditorScreen"

function UserEditPage() {
    const config = PEOPLE_EDITOR_CONFIG.user
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

export default UserEditPage

