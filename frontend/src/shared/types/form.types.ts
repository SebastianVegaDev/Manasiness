export type SelectOption = {
    value: string
    label: string
    disabled?: boolean
    disabledLabel?: string
}

export type FormField = {
    id: string
    name: string
    label: string
    type?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    defaultValue?: string | number
    min?: string | number
    step?: string | number
    inputMode?: "text" | "numeric" | "decimal" | "email" | "tel" | "url" | "search"
    options?: SelectOption[]
}

export type FormValues = Record<string, string | number | boolean | null | undefined>

export type FormPayload = Record<string, unknown>











