import "./SettingsFormContent.css"

import PhoneInput from "@shared/ui/forms/PhoneInput"

import type { FormEvent } from "react"
import type { SettingsFormField } from "@features/settings/shared/types/settings.types"
import type { FormValues } from "@shared/types/form.types"

type SettingsFormContentProps = {
    fields?: SettingsFormField[]
    values?: FormValues
    onSubmit: (formData: FormValues) => void | Promise<void>
    onCancel: () => void
    isLoading?: boolean
    isSubmitting?: boolean
}

function formDataToValues(formData: FormData): FormValues {
    const values: FormValues = {}
    for (const [key, value] of formData.entries()) values[key] = typeof value === "string" ? value : String(value)
    return values
}

function fieldValue(values: FormValues, field: SettingsFormField): string {
    return String(values[field.name] ?? field.defaultValue ?? "")
}

function SettingsFormContent({ fields = [], values = {}, onSubmit, onCancel, isLoading = false, isSubmitting = false }: SettingsFormContentProps) {
    const safeFields = Array.isArray(fields) ? fields : []
    const disabled = isLoading || isSubmitting

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (disabled) return
        await onSubmit(formDataToValues(new FormData(event.currentTarget)))
    }

    return (
        <form key={JSON.stringify(values)} className="shared-config-content" onSubmit={handleSubmit}>
            <div className="shared-config-content-information">
                <div className="shared-config-content-fields">
                    {safeFields.map((item) => (
                        <fieldset className="shared-config-content-field" key={item.id}>
                            <legend>{item.label}</legend>
                            {item.options ? (
                                <select id={item.id} name={item.name} required={item.required} defaultValue={fieldValue(values, item)} disabled={item.disabled || disabled}>
                                    {item.options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
                                </select>
                            ) : item.type === "phone" ? (
                                <PhoneInput id={item.id} name={item.name} placeholder={item.placeholder} defaultValue={fieldValue(values, item)} required={item.required} disabled={item.disabled || disabled} />
                            ) : (
                                <input id={item.id} name={item.name} placeholder={item.placeholder} type={item.type ?? "text"} required={item.required} defaultValue={fieldValue(values, item)} autoComplete={item.autoComplete} minLength={item.minLength} maxLength={item.maxLength} disabled={item.disabled || disabled} readOnly={item.readOnly} />
                            )}
                        </fieldset>
                    ))}
                </div>

                {safeFields.some((item) => item.name === "image") ? (
                    <fieldset className="shared-config-content-image">
                        <legend>Image Profile</legend>
                        <img src={String(values.image ?? "https://i.postimg.cc/DzKtGYCx/nouserphoto.png")} alt="Profile" />
                    </fieldset>
                ) : null}
            </div>
            <div className="shared-config-content-button">
                <button type="submit" id="submit" disabled={disabled}>{isSubmitting ? "Saving..." : "Save"}</button>
                <button type="button" id="cancel" onClick={onCancel} disabled={disabled}>Cancel</button>
            </div>
        </form>
    )
}

export default SettingsFormContent
