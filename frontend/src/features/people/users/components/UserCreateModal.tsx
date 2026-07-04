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

import type { UserCreatePayload } from "@features/people/shared/types/people.types"
import type { CreateModalProps } from "@shared/types/createModal.types"
import type { FormField, FormValues, SelectOption } from "@shared/types/form.types"

const ROLE_OPTIONS: SelectOption[] = [
    { value: "customer", label: "Customer" },
    { value: "supplier", label: "Supplier" },
    { value: "worker", label: "Worker" }
]

function mapUserCreatePayload(values: FormValues): UserCreatePayload {
    return {
        name: String(values.name ?? ""),
        email: String(values.email ?? ""),
        phone: values.phone ? String(values.phone) : null,
        role: String(values.role ?? "customer"),
        image: values.image ? String(values.image) : null,
        status: String(values.status ?? "active")
    }
}

function UserCreateModal({
    onClose,
    onCreate
}: CreateModalProps<UserCreatePayload>) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const fields = useMemo<FormField[]>(() => {
        return [
            textField({
                id: "user-create-name",
                name: "name",
                label: "Name",
                placeholder: "User name"
            }),
            textField({
                id: "user-create-email",
                name: "email",
                label: "Email",
                placeholder: "User email"
            }),
            textField({
                id: "user-create-phone",
                name: "phone",
                label: "Phone",
                placeholder: "User phone"
            }),
            selectField({
                id: "user-create-role",
                name: "role",
                label: "Role",
                options: ROLE_OPTIONS
            }),
            imageField({
                id: "user-create-image",
                name: "image",
                label: "Image",
                placeholder: "Image URL"
            }),
            selectField({
                id: "user-create-status",
                name: "status",
                label: "Status",
                options: statusOptions()
            })
        ]
    }, [])

    async function handleSubmit(values: FormValues): Promise<void> {
        setIsSubmitting(true)

        try {
            await onCreate(mapUserCreatePayload(values))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <FormModal
            title="Create User"
            subtitle="Register a new user in your workspace."
            onClose={onClose}
        >
            <EntityEditForm
                fields={fields}
                title="Create User"
                values={{
                    name: "",
                    email: "",
                    phone: "",
                    role: "customer",
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

export default UserCreateModal
