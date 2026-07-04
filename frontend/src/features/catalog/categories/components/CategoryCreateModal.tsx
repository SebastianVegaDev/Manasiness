import {
    useMemo,
    useState
} from "react"

import FormModal from "@shared/ui/modals/FormModal"
import EntityEditForm from "@shared/ui/forms/EntityEditForm"
import {
    imageField,
    selectField,
    statusOptions,
    textField
} from "@shared/forms/entityField.helpers"

import type { CategoryCreatePayload } from "@features/catalog/shared/types/catalog.types"
import type { CreateModalProps } from "@shared/types/createModal.types"
import type { FormField, FormValues } from "@shared/types/form.types"

function mapCategoryCreatePayload(values: FormValues): CategoryCreatePayload {
    return {
        name: String(values.name ?? ""),
        image: values.image ? String(values.image) : null,
        status: String(values.status ?? "active")
    }
}

function CategoryCreateModal({
    onClose,
    onCreate
}: CreateModalProps<CategoryCreatePayload>) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const fields = useMemo<FormField[]>(() => {
        return [
            textField({
                id: "category-create-name",
                name: "name",
                label: "Name",
                placeholder: "Category name"
            }),
            imageField({
                id: "category-create-image",
                name: "image",
                label: "Image",
                placeholder: "Image URL"
            }),
            selectField({
                id: "category-create-status",
                name: "status",
                label: "Status",
                options: statusOptions()
            })
        ]
    }, [])

    async function handleSubmit(values: FormValues): Promise<void> {
        setIsSubmitting(true)

        try {
            await onCreate(mapCategoryCreatePayload(values))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <FormModal
            title="Create Category"
            subtitle="Register a new category for your catalog."
            onClose={onClose}
        >
            <EntityEditForm
                fields={fields}
                title="Create Category"
                values={{
                    name: "",
                    image: "",
                    status: "active"
                }}
                onSubmit={handleSubmit}
                onCancel={onClose}
                isSubmitting={isSubmitting}
                submitLabel="Create"
                submittingLabel="Creating..."
            />
        </FormModal>
    )
}

export default CategoryCreateModal
