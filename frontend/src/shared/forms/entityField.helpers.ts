import type { FormField, SelectOption } from "@shared/types/form.types"

type TextFieldOptions = {
    id: string
    name: string
    label: string
    placeholder?: string
    required?: boolean
}

type NumberFieldOptions = {
    id: string
    name: string
    label: string
    placeholder?: string
    required?: boolean
    min?: string | number
    step?: string | number
    inputMode?: "numeric" | "decimal"
}

type SelectFieldOptions = {
    id: string
    name: string
    label: string
    options: SelectOption[]
    required?: boolean
}

type ImageFieldOptions = {
    id?: string
    name?: string
    label?: string
    placeholder?: string
}

export function textField({
    id,
    name,
    label,
    placeholder = "",
    required = true
}: TextFieldOptions): FormField {
    return {
        id,
        name,
        label,
        type: "text",
        placeholder,
        required
    }
}

export function passwordField({
    id,
    name,
    label,
    placeholder = "",
    required = true
}: TextFieldOptions): FormField {
    return {
        id,
        name,
        label,
        type: "password",
        placeholder,
        required
    }
}

export function numberField({
    id,
    name,
    label,
    placeholder = "",
    required = true,
    min,
    step = "1",
    inputMode = "numeric"
}: NumberFieldOptions): FormField {
    const field: FormField = {
        id,
        name,
        label,
        type: "number",
        placeholder,
        required,
        step,
        inputMode
    }

    if (min !== undefined) {
        field.min = min
    }

    return field
}

export function selectField({
    id,
    name,
    label,
    options,
    required = true
}: SelectFieldOptions): FormField {
    return {
        id,
        name,
        label,
        type: "select",
        required,
        options
    }
}

export function imageField({
    id = "image",
    name = "image",
    label = "Image",
    placeholder = "Image URL"
}: ImageFieldOptions = {}): FormField {
    return {
        id,
        name,
        label,
        type: "text",
        placeholder,
        required: false
    }
}

export function statusOptions(): SelectOption[] {
    return [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" }
    ]
}








