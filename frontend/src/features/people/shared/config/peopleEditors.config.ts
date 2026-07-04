import {
    getUserById,
    updateUser
} from "@features/people/users/api/users.api"
import {
    mapUserToFormValues,
    mapUserUpdatePayload
} from "@features/people/users/mappers/users.mapper"
import {
    imageField,
    selectField,
    statusOptions,
    textField
} from "@shared/forms/entityField.helpers"

import type { EntityId } from "@shared/types/common.types"
import type { FormField, FormValues } from "@shared/types/form.types"
import type { User } from "../types/people.types"

type PeopleEditorConfig<TEntity> = {
    title: string
    subtitle: string
    emptyMessage: string
    getEntity: (id: EntityId) => Promise<TEntity>
    updateEntity: (id: EntityId, payload: unknown) => Promise<TEntity>
    fields: FormField[]
    mapValues: (entity: TEntity | null | undefined) => FormValues
    mapPayload: (formData: FormValues, entity?: TEntity | null) => unknown
    cancelPath: string
    navigateAfterSave: () => string
    loadErrorMessage: string
    updateSuccessMessage: string
    updateErrorMessage: string
}

const ROLE_OPTIONS = [
    { value: "customer", label: "Customer" },
    { value: "supplier", label: "Supplier" },
    { value: "worker", label: "Worker" }
]

function buildUserFields(): FormField[] {
    return [
        textField({
            id: "user-name",
            name: "name",
            label: "Name",
            placeholder: "User name"
        }),
        textField({
            id: "user-email",
            name: "email",
            label: "Email",
            placeholder: "User email"
        }),
        textField({
            id: "user-phone",
            name: "phone",
            label: "Phone",
            placeholder: "User phone"
        }),
        selectField({
            id: "user-role",
            name: "role",
            label: "Role",
            options: ROLE_OPTIONS
        }),
        imageField({
            id: "user-image",
            name: "image",
            label: "Image",
            placeholder: "Image URL"
        }),
        selectField({
            id: "user-status",
            name: "status",
            label: "Status",
            options: statusOptions()
        })
    ]
}

export const PEOPLE_EDITOR_CONFIG: {
    user: PeopleEditorConfig<User>
} = {
    user: {
        title: "Edit User",
        subtitle: "Update user information.",
        emptyMessage: "User not found.",

        getEntity: getUserById,
        updateEntity: (id, payload) => updateUser(id, payload as Parameters<typeof updateUser>[1]),

        fields: buildUserFields(),

        mapValues: mapUserToFormValues,
        mapPayload: mapUserUpdatePayload,

        cancelPath: "/dashboard/users",
        navigateAfterSave: () => "/dashboard/users",

        loadErrorMessage: "Could not load user",
        updateSuccessMessage: "User updated successfully",
        updateErrorMessage: "Could not update user"
    }
}


