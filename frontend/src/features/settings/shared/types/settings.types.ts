import type {
    BootstrapData,
    BootstrapStore
} from "@features/bootstrap/shared/types/bootstrap.types"
import type {
    FormPayload,
    FormValues,
    SelectOption
} from "@shared/types/form.types"

export type SettingsFormField = {
    id: string
    name: string
    label: string
    type?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    readOnly?: boolean
    defaultValue?: string | number
    autoComplete?: string
    minLength?: number
    maxLength?: number
    options?: SelectOption[]
}

export type StoreInformationValues = FormValues & {
    name?: string
    email?: string
    phone?: string
    currency_code?: string
    image?: string
}

export type PasswordValues = FormValues & {
    currentPassword?: string
    newPassword?: string
    repeatPassword?: string
}

export type StoreInformationPayload = {
    name: string
    email: string
    phone: string | null
    currency_code: string
    image: string | null
}

export type PasswordPayload = {
    currentPassword: string
    newPassword: string
    repeatPassword: string
}

export type SettingsApiResponse = {
    store?: BootstrapStore
    information?: BootstrapStore
    data?: BootstrapStore
    [key: string]: unknown
}

export type SettingsFormConfig = {
    title: string
    subtitle?: string
    fields: SettingsFormField[]
    getInitialValues?: (source?: BootstrapData | null | unknown) => FormValues
    loadData?: () => Promise<unknown>
    updateData: (payload: FormPayload | StoreInformationPayload | PasswordPayload) => Promise<unknown>
    mapValues?: (source?: unknown) => FormValues
    mapPayload?: (formData: FormValues) => FormPayload | StoreInformationPayload | PasswordPayload
    mapUpdatedStore?: (source?: unknown) => BootstrapStore
    validate?: (formData: FormValues) => string | null
    updateBootstrapStore?: boolean
    refreshSessionAfterSubmit?: boolean
    resetAfterSubmit?: boolean
    loadErrorMessage?: string
    updateSuccessMessage?: string
    updateErrorMessage?: string
}

export type SettingsFormScreenProps = {
    title: string
    subtitle?: string
    fields: SettingsFormField[]
    values: FormValues
    onSubmit: (formData: FormValues) => void | Promise<void>
    onCancel: () => void
    isLoading?: boolean
    isSubmitting?: boolean
}

export type UseSettingsFormPageState = {
    fields: SettingsFormField[]
    values: FormValues
    isLoading: boolean
    isSubmitting: boolean
    handleSubmit: (formData: FormValues) => Promise<void>
    handleCancel: () => void
    reload: () => Promise<void>
}
