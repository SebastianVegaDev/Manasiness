import type {
    PasswordPayload,
    SettingsApiResponse,
    StoreInformationPayload
} from "../types/settings.types"
import type { BootstrapStore } from "@features/bootstrap/shared/types/bootstrap.types"
import type { FormValues } from "@shared/types/form.types"

function toRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object"
        ? value as Record<string, unknown>
        : {}
}

function unwrapStoreInformation(response: unknown): BootstrapStore {
    const responseRecord = toRecord(response as SettingsApiResponse)
    const store =
        responseRecord.store ??
        responseRecord.information ??
        responseRecord.data ??
        responseRecord

    return toRecord(store) as BootstrapStore
}

function readString(value: unknown, fallback: string = ""): string {
    return typeof value === "string" ? value : fallback
}

export function mapInformationValues(response?: unknown): FormValues {
    const information = unwrapStoreInformation(response)

    return {
        name: readString(information.name),
        email: readString(information.email),
        phone: readString(information.phone),
        currency_code: readString(
            information.currency_code ?? information.currencyCode,
            "PEN"
        ),
        image: readString(information.image)
    }
}

export function mapInformationPayload(formData: FormValues): StoreInformationPayload {
    return {
        name: String(formData.name ?? ""),
        email: String(formData.email ?? ""),
        phone: formData.phone ? String(formData.phone) : null,
        currency_code: String(formData.currency_code ?? "PEN"),
        image: formData.image ? String(formData.image) : null
    }
}

export function mapPasswordValues(): FormValues {
    return {
        currentPassword: "",
        newPassword: "",
        repeatPassword: ""
    }
}

export function mapPasswordPayload(formData: FormValues): PasswordPayload {
    return {
        currentPassword: String(formData.currentPassword ?? ""),
        newPassword: String(formData.newPassword ?? ""),
        repeatPassword: String(formData.repeatPassword ?? "")
    }
}

export function mapUpdatedStore(response?: unknown): BootstrapStore {
    return unwrapStoreInformation(response)
}
