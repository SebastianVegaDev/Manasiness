import { informationFormFields } from "@features/settings/information/config/informationFormFields"
import { passwordFormFields } from "@features/settings/password/config/passwordFormFields"

import {
    getStoreInformation,
    updateStoreInformation,
    updateStorePassword
} from "../api/settings.api"
import {
    mapInformationPayload,
    mapInformationValues,
    mapPasswordPayload,
    mapPasswordValues,
    mapUpdatedStore
} from "../mappers/settings.mapper"

import type { SettingsFormConfig } from "../types/settings.types"
import type {
    PasswordPayload,
    StoreInformationPayload
} from "../types/settings.types"
import type { FormValues } from "@shared/types/form.types"

function validatePassword(formData: FormValues): string | null {
    if (formData.newPassword !== formData.repeatPassword) {
        return "Passwords do not match"
    }

    return null
}

export const SETTINGS_FORM_CONFIG: Record<"information" | "password", SettingsFormConfig> = {
    information: {
        title: "Information",
        subtitle: "On this page you can manage your store information.",
        fields: informationFormFields,
        getInitialValues: mapInformationValues,
        loadData: getStoreInformation,
        updateData: (payload) => updateStoreInformation(payload as StoreInformationPayload),
        mapValues: mapInformationValues,
        mapPayload: mapInformationPayload,
        mapUpdatedStore,
        updateBootstrapStore: true,
        refreshSessionAfterSubmit: true,
        loadErrorMessage: "Could not load store information",
        updateSuccessMessage: "Information updated successfully",
        updateErrorMessage: "Could not update information"
    },

    password: {
        title: "Password",
        subtitle: "On this page you can update your password.",
        fields: passwordFormFields,
        getInitialValues: mapPasswordValues,
        updateData: (payload) => updateStorePassword(payload as PasswordPayload),
        mapPayload: mapPasswordPayload,
        validate: validatePassword,
        resetAfterSubmit: true,
        updateSuccessMessage: "Password updated successfully",
        updateErrorMessage: "Could not update password"
    }
}
