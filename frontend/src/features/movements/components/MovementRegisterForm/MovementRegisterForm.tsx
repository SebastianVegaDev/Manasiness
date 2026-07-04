import "./MovementRegisterForm.css"

import {
    useEffect,
    useMemo,
    useState
} from "react"

import FormModal from "@shared/ui/modals/FormModal"
import LoadingOverlay from "@shared/ui/modal/LoadingOverlay"

import type { FormEvent } from "react"
import type {
    MovementField,
    MovementFieldOption
} from "@features/movements/shared/types/movement.types"
import type { FormValues } from "@shared/types/form.types"

type MovementRegisterFormProps = {
    title: string
    sectionLabel?: string
    fields: MovementField[]
    helperMessage?: string
    isSubmitting?: boolean
    onClose: () => void
    onSubmit: (formData: FormValues) => void | Promise<void>
}

function getInitialValues(fields: MovementField[]): FormValues {
    const values: FormValues = {}

    for (const field of fields) {
        values[field.name] = field.defaultValue ?? ""
    }

    return values
}

function isOptionDisabled(option: MovementFieldOption, values: FormValues): boolean {
    if (option.disabled) {
        return true
    }

    if (option.disabledWhen) {
        return option.disabledWhen(values)
    }

    return false
}

function getOptionLabel(option: MovementFieldOption, values: FormValues): string {
    if (option.disabledWhen?.(values) && option.disabledLabel) {
        return option.disabledLabel
    }

    return option.label
}

function shouldRenderAsSelect(field: MovementField): boolean {
    return Boolean(field.options?.length)
}

function MovementRegisterForm({
    title,
    sectionLabel = "Movement",
    fields,
    helperMessage = "",
    isSubmitting = false,
    onClose,
    onSubmit
}: MovementRegisterFormProps) {
    const safeFields = useMemo(() => {
        return Array.isArray(fields) ? fields : []
    }, [fields])

    const [values, setValues] = useState<FormValues>(() => getInitialValues(safeFields))

    useEffect(() => {
        setValues(getInitialValues(safeFields))
    }, [safeFields])

    useEffect(() => {
        setValues((currentValues) => {
            const currentState = String(currentValues.state ?? "")

            if (!currentState) {
                return currentValues
            }

            const stateField = safeFields.find((field) => field.name === "state")
            const selectedOption = stateField?.options?.find((option) => {
                return option.value === currentState
            })

            if (!selectedOption || !isOptionDisabled(selectedOption, currentValues)) {
                return currentValues
            }

            return {
                ...currentValues,
                state: "paid"
            }
        })
    }, [safeFields, values.user_id])

    function handleValueChange(name: string, value: string): void {
        setValues((currentValues) => ({
            ...currentValues,
            [name]: value
        }))
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()

        if (isSubmitting) {
            return
        }

        await onSubmit(values)
    }

    const isDisabled = isSubmitting || safeFields.some((field) => field.disabled)

    return (
        <FormModal
            title={title}
            subtitle={`Register a new ${sectionLabel.toLowerCase()} record.`}
            onClose={onClose}
        >
            <form className="movement-register-form" onSubmit={handleSubmit}>
                <div className="movement-register-form-heading">
                    <span>{sectionLabel}</span>
                    <h2>{title}</h2>
                    <p>Complete the fields below to register this movement correctly.</p>
                </div>

                {helperMessage ? (
                    <p className="movement-register-form-helper">
                        {helperMessage}
                    </p>
                ) : null}

                <div className="movement-register-form-fields">
                    {safeFields.map((field) => {
                        const value = values[field.name] ?? ""
                        const fieldDisabled = isSubmitting || Boolean(field.disabled)

                        if (shouldRenderAsSelect(field)) {
                            return (
                                <label className="movement-register-form-field" key={field.name}>
                                    <span>{field.label}</span>

                                    <select
                                        id={field.id}
                                        name={field.name}
                                        value={String(value)}
                                        required={field.required}
                                        disabled={fieldDisabled}
                                        onChange={(event) => {
                                            handleValueChange(field.name, event.target.value)
                                        }}
                                    >
                                        {(field.options ?? []).map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                                disabled={isOptionDisabled(option, values)}
                                            >
                                                {getOptionLabel(option, values)}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )
                        }

                        return (
                            <label className="movement-register-form-field" key={field.name}>
                                <span>{field.label}</span>

                                <input
                                    id={field.id}
                                    name={field.name}
                                    type={field.type ?? "text"}
                                    placeholder={field.placeholder}
                                    value={String(value)}
                                    required={field.required}
                                    disabled={fieldDisabled}
                                    min={field.min}
                                    step={field.step}
                                    inputMode={field.inputMode}
                                    onChange={(event) => {
                                        handleValueChange(field.name, event.target.value)
                                    }}
                                />
                            </label>
                        )
                    })}
                </div>

                <div className="movement-register-form-actions">
                    <button
                        id="cancel"
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>

                    <button
                        id="submit"
                        type="submit"
                        disabled={isDisabled}
                    >
                        {isSubmitting ? "Registering..." : "Register"}
                    </button>
                </div>
                {isSubmitting ? <LoadingOverlay /> : null}
            </form>
        </FormModal>
    )
}

export default MovementRegisterForm
