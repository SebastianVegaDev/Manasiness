import {
    parseOptionalImage,
    parseOptionalPhone,
    requireCurrencyCode,
    requireEmail,
    requireObject,
    requireText
} from "../../shared/validators/index.js"

export function validateEditInformationPayload(body: unknown) {
    const data = requireObject(body)

    return {
        name: requireText(data.name, "name"),
        email: requireEmail(data.email, "email"),
        phone: parseOptionalPhone(data.phone, "phone"),
        currency_code: requireCurrencyCode(data.currency_code || "PEN", "currency_code"),
        image: parseOptionalImage(data.image, "image")
    }
}