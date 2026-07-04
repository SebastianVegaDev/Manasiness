import type { FinancePeriod } from "../types/finance.types"

function padDatePart(value: number): string {
    return String(value).padStart(2, "0")
}

export function toISODate(date: Date): string {
    const year = date.getFullYear()
    const month = padDatePart(date.getMonth() + 1)
    const day = padDatePart(date.getDate())

    return `${year}-${month}-${day}`
}

export function parseFinanceDate(value: string | null | undefined): Date | null {
    if (!value) {
        return null
    }

    const normalizedValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? `${value}T00:00:00`
        : value

    const date = new Date(normalizedValue)

    return Number.isNaN(date.getTime()) ? null : date
}

export function formatFinanceDateLabel(value: string | null | undefined): string {
    const date = parseFinanceDate(value)

    if (!date) {
        return ""
    }

    const day = padDatePart(date.getDate())
    const month = padDatePart(date.getMonth() + 1)
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
}

export function getCurrentFinancePeriodDate(): string {
    return toISODate(new Date())
}

export function getTodayDateString(): string {
    return getCurrentFinancePeriodDate()
}

export function resolveChartDate(value: unknown): string {
    if (typeof value === "string") {
        return value
    }

    if (value && typeof value === "object") {
        const record = value as Record<string, unknown>

        if (typeof record.day === "string") {
            return record.day
        }

        if (typeof record.date === "string") {
            return record.date
        }
    }

    return ""
}

export function normalizeFinancePeriod(value: string): FinancePeriod {
    return value === "month" ? "month" : "week"
}

