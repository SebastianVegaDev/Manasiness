import type { EntityId } from "@shared/types/common.types"
import type { FormField, FormValues } from "@shared/types/form.types"

export type EntityEditorCancelPath<TEntity> =
    | string
    | ((entity: TEntity | null, entityId: EntityId) => string)

export type EntityEditorNavigateAfterSave<TEntity> = (
    entity: TEntity | null,
    entityId: EntityId
) => string

export type EntityEditorPageConfig<TEntity = unknown> = {
    title?: string
    subtitle?: string
    emptyMessage?: string

    idParamName?: string

    getEntity: (id: EntityId) => Promise<TEntity>
    updateEntity: (id: EntityId, payload: unknown) => Promise<TEntity>

    fields?: FormField[]
    buildFields?: (entity: TEntity | null) => FormField[]

    mapEntity?: (response: unknown) => TEntity | null
    mapValues?: (entity: TEntity) => FormValues
    mapPayload?: (formData: FormValues, entity: TEntity | null) => unknown

    cancelPath?: EntityEditorCancelPath<TEntity>
    navigateAfterSave?: EntityEditorNavigateAfterSave<TEntity>

    loadErrorMessage?: string
    updateSuccessMessage?: string
    updateErrorMessage?: string
}

export type EntityEditorPageState<TEntity = unknown> = {
    entity: TEntity | null
    entityId: EntityId | null
    values: FormValues
    fields: FormField[]
    isLoading: boolean
    isSubmitting: boolean
    handleSubmit: (formData: FormValues) => Promise<void>
    handleCancel: () => void
    reload: () => Promise<void>
}



