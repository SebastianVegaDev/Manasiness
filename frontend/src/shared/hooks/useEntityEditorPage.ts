import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

import { getApiErrorMessage } from "@shared/api/httpError"

import type { EntityId } from "@shared/types/common.types"
import type {
    EntityEditorPageConfig,
    EntityEditorPageState
} from "@shared/types/entityEditor.types"
import type { FormField, FormValues } from "@shared/types/form.types"

function getEntityId(
    params: Record<string, string | undefined>,
    idParamName: string
): EntityId | null {
    return params[idParamName] ?? params.id ?? null
}

export function useEntityEditorPage<TEntity = unknown>(
    config: EntityEditorPageConfig<TEntity>
): EntityEditorPageState<TEntity> {
    const params = useParams()
    const navigate = useNavigate()

    const entityId = getEntityId(params, config.idParamName ?? "id")

    const [entity, setEntity] = useState<TEntity | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const loadEntity = useCallback(async () => {
        if (!entityId) {
            setEntity(null)
            setIsLoading(false)
            return
        }

        setIsLoading(true)

        try {
            const response = await config.getEntity(entityId)
            const mappedEntity = config.mapEntity ? config.mapEntity(response) : response

            setEntity(mappedEntity ?? null)
        } catch (caughtError) {
            console.error(caughtError)
            setEntity(null)
            toast.error(getApiErrorMessage(caughtError, config.loadErrorMessage ?? "Could not load information"))
        } finally {
            setIsLoading(false)
        }
    }, [config, entityId])

    useEffect(() => {
        void loadEntity()
    }, [loadEntity])

    const values = useMemo<FormValues>(() => {
        if (!entity) {
            return {}
        }

        if (config.mapValues) {
            return config.mapValues(entity)
        }

        return entity as FormValues
    }, [config, entity])

    const fields = useMemo<FormField[]>(() => {
        if (config.buildFields) {
            return config.buildFields(entity)
        }

        return config.fields ?? []
    }, [config, entity])

    async function handleSubmit(formData: FormValues): Promise<void> {
        if (!entityId) {
            return
        }

        setIsSubmitting(true)

        try {
            const payload = config.mapPayload ? config.mapPayload(formData, entity) : formData

            const response = await config.updateEntity(entityId, payload)
            const mappedEntity = config.mapEntity ? config.mapEntity(response) : response
            const nextEntity = mappedEntity ?? entity

            setEntity(nextEntity)

            toast.success(config.updateSuccessMessage ?? "Updated successfully")

            if (config.navigateAfterSave) {
                navigate(config.navigateAfterSave(nextEntity, entityId))
            }
        } catch (caughtError) {
            console.error(caughtError)
            toast.error(getApiErrorMessage(caughtError, config.updateErrorMessage ?? "Could not update information"))
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleCancel(): void {
        if (config.cancelPath) {
            const nextPath = typeof config.cancelPath === "function"
                ? config.cancelPath(entity, entityId ?? "")
                : config.cancelPath

            navigate(nextPath)
            return
        }

        navigate(-1)
    }

    return {
        entity,
        entityId,
        values,
        fields,
        isLoading,
        isSubmitting,
        handleSubmit,
        handleCancel,
        reload: loadEntity
    }
}

export default useEntityEditorPage


