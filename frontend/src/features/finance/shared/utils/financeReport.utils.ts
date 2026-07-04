import type {
    FinanceDaySummaryResponse,
    FinanceReportResponse,
    FinanceSummaryCard
} from "../types/finance.types"
import type { CurrencyCode } from "@shared/types/common.types"

export function toNumber(value: unknown): number {
    const numericValue = Number(value ?? 0)
    return Number.isFinite(numericValue) ? numericValue : 0
}

function getRecordValue(record: Record<string, unknown>, keys: string[]): unknown {
    for (const key of keys) {
        if (record[key] !== undefined && record[key] !== null) {
            return record[key]
        }
    }

    return undefined
}

export function toRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object"
        ? value as Record<string, unknown>
        : {}
}

export function getFinanceRows(response: FinanceReportResponse | null | undefined): unknown[] {
    if (!response) {
        return []
    }

    if (Array.isArray(response)) {
        return response
    }

    if (Array.isArray(response.rows)) {
        return response.rows
    }

    if (Array.isArray(response.data)) {
        return response.data
    }

    if (Array.isArray(response.chart)) {
        return response.chart
    }

    return []
}

export function getFinanceSummaryValues(
    response: FinanceReportResponse | FinanceDaySummaryResponse | null | undefined,
    currencyCode: CurrencyCode | string
): FinanceSummaryCard {
    const responseRecord = toRecord(response)
    const dataRecord = toRecord(responseRecord.data)
    const summaryRecord = toRecord(responseRecord.summary)

    const total = toNumber(
        getRecordValue(summaryRecord, ["total", "amount"]) ??
        getRecordValue(dataRecord, ["total", "amount"]) ??
        getRecordValue(responseRecord, ["total", "amount"])
    )

    const count = toNumber(
        getRecordValue(summaryRecord, ["count", "quantity", "records"]) ??
        getRecordValue(dataRecord, ["count", "quantity", "records"]) ??
        getRecordValue(responseRecord, ["count", "quantity", "records"])
    )

    const average = toNumber(
        getRecordValue(summaryRecord, ["average", "avg"]) ??
        getRecordValue(dataRecord, ["average", "avg"]) ??
        getRecordValue(responseRecord, ["average", "avg"]) ??
        (count > 0 ? total / count : 0)
    )

    return {
        total,
        count,
        average,
        currencyCode
    }
}



export function normalizeReportRows(data: unknown): unknown[] {
    if (Array.isArray(data)) {
        return data
    }

    return getFinanceRows(toRecord(data) as FinanceReportResponse)
}

export function shouldUseBootstrapReport({
    period,
    offset
}: {
    period: string
    offset: number
}): boolean {
    return period === "week" && offset === 0
}

function getDateFromRecord(record: Record<string, unknown>): string {
    const value =
        record.date ??
        record.day ??
        record.created_at ??
        record.createdAt

    return typeof value === "string" ? value : ""
}

export function getReportMeta(rows: unknown[]): {
    startDate: string
    endDate: string
    hasOlder: boolean
} {
    const safeRows = Array.isArray(rows) ? rows : []
    const firstRecord = toRecord(safeRows[0])
    const lastRecord = toRecord(safeRows[safeRows.length - 1])

    return {
        startDate: getDateFromRecord(firstRecord),
        endDate: getDateFromRecord(lastRecord),
        hasOlder: safeRows.length > 0
    }
}
