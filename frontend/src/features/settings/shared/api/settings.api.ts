import {
    apiGet,
    apiPost
} from "@shared/api/client"

import type {
    PasswordPayload,
    SettingsApiResponse,
    StoreInformationPayload
} from "../types/settings.types"

export async function getStoreInformation(): Promise<SettingsApiResponse> {
    return apiGet<SettingsApiResponse>("/information")
}

export async function updateStoreInformation(
    payload: StoreInformationPayload
): Promise<SettingsApiResponse> {
    return apiPost<SettingsApiResponse, StoreInformationPayload>("/information/edit", payload)
}

export async function updateStorePassword(
    payload: PasswordPayload
): Promise<SettingsApiResponse> {
    return apiPost<SettingsApiResponse, PasswordPayload>("/password/edit", payload)
}
