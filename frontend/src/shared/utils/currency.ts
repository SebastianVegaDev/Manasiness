import type { CurrencyCode } from "@shared/types/common.types"

const CURRENCY_LOCALE: Record<CurrencyCode, string> = {
    PEN: "es-PE",
    USD: "en-US",
    EUR: "de-DE"
}

function normalizeCurrencyCode(currencyCode: string | null | undefined): CurrencyCode {
    if (currencyCode === "USD" || currencyCode === "EUR" || currencyCode === "PEN") {
        return currencyCode
    }

    return "PEN"
}

export function formatCurrency(value: unknown, currencyCode: string | null | undefined = "PEN"): string {
    const normalizedCurrencyCode = normalizeCurrencyCode(currencyCode)
    const amount = Number(value ?? 0)

    return new Intl.NumberFormat(CURRENCY_LOCALE[normalizedCurrencyCode], {
        style: "currency",
        currency: normalizedCurrencyCode
    }).format(Number.isFinite(amount) ? amount : 0)
}











export const CURRENCY_OPTIONS = [
    { value: "PEN", label: "PEN" },
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" }
]
