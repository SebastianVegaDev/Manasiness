import "./EntityEditForm.css"

import LoadingOverlay from "@shared/ui/modal/LoadingOverlay"
import PhoneInput from "./PhoneInput"

import type { FormEvent } from "react"
import type { FormField, FormValues } from "@shared/types/form.types"

type EntityEditFormProps = {
    fields: FormField[]
    sectionLabel?: string
    title?: string
    values: FormValues
    onCancel?: () => void
    onSubmit: (formData: FormValues) => void | Promise<void>
    isLoading?: boolean
    isSubmitting?: boolean
    submitLabel?: string
    submittingLabel?: string
    cancelLabel?: string
}

function formDataToValues(formData: FormData): FormValues {
    const values: FormValues = {}

    for (const [key, value] of formData.entries()) {
        values[key] = typeof value === "string" ? value : String(value)
    }

    return values
}

function EntityEditForm({
    fields,
    sectionLabel = "Information",
    title = "Edit Information",
    values,
    onCancel,
    onSubmit,
    isLoading = false,
    isSubmitting = false,
    submitLabel = "Save",
    submittingLabel = "Saving...",
    cancelLabel = "Cancel"
}: EntityEditFormProps) {
    const safeFields = Array.isArray(fields) ? fields : []
    const disabled = isLoading || isSubmitting

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (disabled) {
            return
        }

        const formData = new FormData(event.currentTarget)
        await onSubmit(formDataToValues(formData))
    }

    return (
        <form key={JSON.stringify(values)} className="shared-entity-edit-form" onSubmit={handleSubmit}>
            <div className="shared-entity-edit-form-hero">
                <h4>{sectionLabel}----</h4>
                <h1>{title}</h1>
            </div>
            <div className="shared-entity-edit-form-content">
                {safeFields.map((field) => (
                    <div className="shared-entity-edit-form-group" key={field.id}>
                        <label htmlFor={field.id}>{field.label}</label>
                        {field.options ? (
                            <select
                                id={field.id}
                                name={field.name}
                                defaultValue={String(values?.[field.name] ?? field.defaultValue ?? "")}
                                required={field.required}
                                disabled={field.disabled || disabled}
                            >
                                {field.options.map((option) => (
                                    <option key={option.value} value={option.value} disabled={option.disabled}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : field.type === "phone" ? (
                            <PhoneInput
                                id={field.id}
                                name={field.name}
                                placeholder={field.placeholder}
                                defaultValue={String(values?.[field.name] ?? field.defaultValue ?? "")}
                                required={field.required}
                                disabled={field.disabled || disabled}
                            />
                        ) : field.type === "textarea" ? (
                            <textarea
                                id={field.id}
                                name={field.name}
                                placeholder={field.placeholder}
                                defaultValue={String(values?.[field.name] ?? field.defaultValue ?? "")}
                                required={field.required}
                                disabled={field.disabled || disabled}
                            />
                        ) : (
                            <input
                                id={field.id}
                                name={field.name}
                                placeholder={field.placeholder}
                                type={field.type ?? "text"}
                                defaultValue={String(values?.[field.name] ?? field.defaultValue ?? "")}
                                required={field.required}
                                disabled={field.disabled || disabled}
                                min={field.min}
                                step={field.step}
                                inputMode={field.inputMode}
                            />
                        )}
                    </div>
                ))}
                <div className="shared-entity-edit-form-actions">
                    <button id="submit" type="submit" disabled={disabled}>
                        {isSubmitting ? submittingLabel : submitLabel}
                    </button>
                    {onCancel ? (
                        <button id="cancel" type="button" onClick={onCancel} disabled={disabled}>
                            {cancelLabel}
                        </button>
                    ) : null}
                </div>
            </div>
            {disabled ? <LoadingOverlay /> : null}
        </form>
    )
}

export default EntityEditForm
