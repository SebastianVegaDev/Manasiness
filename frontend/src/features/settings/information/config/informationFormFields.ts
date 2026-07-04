import { CURRENCY_OPTIONS } from "@shared/utils/currency"

import type { SettingsFormField } from "@features/settings/shared/types/settings.types"

export const informationFormFields: SettingsFormField[] = [
    {
        label: "Store Name",
        placeholder: "Write your store name",
        id: "information-name",
        name: "name",
        type: "text",
        required: true
    },
    {
        label: "Email",
        placeholder: "Write your email",
        id: "information-email",
        name: "email",
        type: "email",
        required: true
    },
    {
        label: "Phone Number",
        placeholder: "999 999 999",
        id: "information-phone",
        name: "phone",
        type: "phone"
    },
    {
        label: "Currency",
        id: "information-currency",
        name: "currency_code",
        options: CURRENCY_OPTIONS,
        required: true,
        defaultValue: "PEN"
    },
    {
        label: "Profile Image URL",
        placeholder: "Write image URL",
        id: "information-image",
        name: "image",
        type: "text"
    }
]
