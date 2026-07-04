import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import { useAuth } from "@features/auth/hooks/useAuth"
import { useBootstrapData } from "@features/bootstrap/hooks/useBootstrapData"
import { updateBootstrapStore } from "@features/bootstrap/updaters/bootstrap.updaters"
import { getApiErrorMessage } from "@shared/api/httpError"

import type {
    SettingsFormConfig,
    UseSettingsFormPageState
} from "../types/settings.types"
import type { BootstrapData } from "@features/bootstrap/shared/types/bootstrap.types"
import type { FormValues } from "@shared/types/form.types"

function getInitialValues(
    config: SettingsFormConfig,
    bootstrapData: BootstrapData | null
): FormValues {
    if (config.getInitialValues) {
        return config.getInitialValues(bootstrapData)
    }

    return {}
}

export function useSettingsFormPage(config: SettingsFormConfig): UseSettingsFormPageState {
    const bootstrap = useBootstrapData()
    const { loadSession } = useAuth()
    const navigate = useNavigate()

    const initialValues = useMemo(() => {
        return getInitialValues(config, bootstrap.data)
    }, [
        bootstrap.data,
        config
    ])

    const [values, setValues] = useState<FormValues>(initialValues)
    const [isLoading, setIsLoading] = useState<boolean>(Boolean(config.loadData))
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const loadSettings = useCallback(async () => {
        if (!config.loadData) {
            setValues(getInitialValues(config, bootstrap.data))
            setIsLoading(false)
            return
        }

        setIsLoading(true)

        try {
            const response = await config.loadData()
            const mappedValues = config.mapValues ? config.mapValues(response) : response

            setValues(
                mappedValues && typeof mappedValues === "object"
                    ? mappedValues as FormValues
                    : {}
            )
        } catch (caughtError) {
            console.error(caughtError)
            toast.error(getApiErrorMessage(
                caughtError,
                config.loadErrorMessage ?? "Could not load information"
            ))
        } finally {
            setIsLoading(false)
        }
    }, [
        bootstrap.data,
        config
    ])

    useEffect(() => {
        void loadSettings()
    }, [loadSettings])

    async function handleSubmit(formData: FormValues): Promise<void> {
        const validationMessage = config.validate?.(formData)

        if (validationMessage) {
            toast.error(validationMessage)
            return
        }

        setIsSubmitting(true)

        try {
            const payload = config.mapPayload ? config.mapPayload(formData) : formData
            const response = await config.updateData(payload)

            if (config.mapValues) {
                setValues(config.mapValues(response))
            }

            if (config.updateBootstrapStore) {
                const updatedStore = config.mapUpdatedStore
                    ? config.mapUpdatedStore(response)
                    : {}

                bootstrap.updateBootstrap((currentData) => {
                    return updateBootstrapStore(currentData, updatedStore)
                })
            }

            if (config.refreshSessionAfterSubmit) {
                await loadSession()
            }

            if (config.resetAfterSubmit || !config.loadData) {
                setValues(getInitialValues(config, bootstrap.data))
            }

            toast.success(config.updateSuccessMessage ?? "Updated successfully")
        } catch (caughtError) {
            console.error(caughtError)
            toast.error(getApiErrorMessage(
                caughtError,
                config.updateErrorMessage ?? "Could not update information"
            ))
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleCancel(): void {
        navigate("/dashboard")
    }

    return {
        fields: config.fields ?? [],
        values,
        isLoading: isLoading || bootstrap.isLoading,
        isSubmitting,
        handleSubmit,
        handleCancel,
        reload: loadSettings
    }
}

export default useSettingsFormPage
