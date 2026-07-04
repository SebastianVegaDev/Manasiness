import { badRequest } from "../../errors/http-errors.js"
import { requireText } from "./base.validators.js"

const DEFAULT_IMAGE = "https://i.postimg.cc/DzKtGYCx/nouserphoto.png"

export const CURRENCY_SYMBOLS = {
    PEN: "S/",
    USD: "$",
    EUR: "€",
    MXN: "$",
    COP: "$",
    CLP: "$",
    ARS: "$",
    BRL: "R$"
} as const

export type CurrencyCode = keyof typeof CURRENCY_SYMBOLS

export function requireEmail(value: unknown, fieldName = "email"): string {
    const parsed = requireText(value, fieldName).toLowerCase()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed)) {
        throw badRequest(`${fieldName} invalid`)
    }

    return parsed
}

export function requirePhone(value: unknown, fieldName = "phone"): string {
    const parsed = requireText(value, fieldName).replace(/[\s()-]/g, "")
    const phone = parsed.startsWith("+") ? parsed : `+51${parsed}`

    if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
        throw badRequest(`${fieldName} invalid`)
    }

    return phone
}

export function parseOptionalPhone(value: unknown, fieldName = "phone"): string | null {
    if (value === undefined || value === null || value === "") {
        return null
    }

    return requirePhone(value, fieldName)
}

export function requireCurrencyCode(value: unknown, fieldName = "currency_code"): CurrencyCode {
    const parsed = requireText(value, fieldName).toUpperCase()

    if (!(parsed in CURRENCY_SYMBOLS)) {
        throw badRequest(`${fieldName} invalid`)
    }

    return parsed as CurrencyCode
}

export function getCurrencySymbol(currencyCode: CurrencyCode = "PEN"): string {
    return CURRENCY_SYMBOLS[currencyCode] || CURRENCY_SYMBOLS.PEN
}

export function parseOptionalImage(value: unknown, fieldName = "image"): string {
    if (value === undefined || value === null || value === "") {
        return DEFAULT_IMAGE
    }

    if (typeof value !== "string") {
        throw badRequest(`${fieldName} invalid`)
    }

    const parsed = value.trim()

    return parsed || DEFAULT_IMAGE
}

export function requireLoginPassword(value: unknown, fieldName = "password"): string {
    if (typeof value !== "string") {
        throw badRequest(`${fieldName} invalid`)
    }

    if (!value.trim()) {
        throw badRequest(`${fieldName} invalid`)
    }

    if (Buffer.byteLength(value, "utf8") > 72) {
        throw badRequest(`${fieldName} invalid`)
    }

    return value
}

export function requirePassword(value: unknown, fieldName = "password"): string {
    const parsed = requireLoginPassword(value, fieldName)

    if (parsed.length < 8) {
        throw badRequest(`${fieldName} invalid`)
    }

    return parsed
}

export function requireVerificationCode(value: unknown, fieldName = "code"): string {
    const parsed = requireText(value, fieldName)

    if (!/^\d{6}$/.test(parsed)) {
        throw badRequest(`${fieldName} invalid`)
    }

    return parsed
}

export function requirePasswordMatch(
    password: string,
    repeatPassword: string,
    fieldName = "password"
): void {
    if (password !== repeatPassword) {
        throw badRequest(`${fieldName} invalid`)
    }
}