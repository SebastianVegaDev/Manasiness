import "./EntityEditorScreen.css"

import EntityEditForm from "@shared/ui/forms/EntityEditForm"
import LoadingOverlay from "@shared/ui/modal/LoadingOverlay"

import type { FormField, FormValues } from "@shared/types/form.types"

type EntityEditorScreenProps = {
    title: string
    subtitle?: string
    fields: FormField[]
    values: FormValues
    onSubmit: (formData: FormValues) => void | Promise<void>
    onCancel: () => void
    isLoading?: boolean
    isSubmitting?: boolean
    emptyMessage?: string
}

function EntityEditorScreen({
    title,
    subtitle = "Information",
    fields,
    values,
    onSubmit,
    onCancel,
    isLoading = false,
    isSubmitting = false,
    emptyMessage = "Information not found."
}: EntityEditorScreenProps) {
    const hasValues = values && Object.keys(values).length > 0

    return (
        <div className="shared-entity-layout">
            {hasValues ? (
                <EntityEditForm
                    sectionLabel={subtitle}
                    title={title}
                    fields={fields}
                    values={values}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    isLoading={isLoading}
                    isSubmitting={isSubmitting}
                />
            ) : (
                <div className="shared-entity-details">
                    <p>{emptyMessage}</p>
                </div>
            )}
            {isLoading ? <LoadingOverlay /> : null}
        </div>
    )
}

export default EntityEditorScreen
