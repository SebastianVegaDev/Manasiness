import {
    formatFinanceDateLabel,
    toISODate
} from "../utils/financeDate.utils"
import {
    getFinanceRows,
    getFinanceSummaryValues,
    toNumber,
    toRecord
} from "../utils/financeReport.utils"

import type {
    FinanceChartPoint,
    FinanceDaySummaryResponse,
    FinanceReportConfig,
    FinanceReportResponse,
    FinanceSummaryCard,
    FinanceSummaryLabels,
    PendingRow,
    PendingRowsResponse,
    PendingSummary,
    PendingSummaryResponse
} from "../types/finance.types"
import type { CurrencyCode } from "@shared/types/common.types"

function getDateFromRecord(record: Record<string, unknown>): string {
    const value =
        record.date ??
        record.day ??
        record.created_at ??
        record.createdAt

    if (typeof value === "string") {
        return value
    }

    return toISODate(new Date())
}

function getTotalFromRecord(record: Record<string, unknown>): number {
    return toNumber(
        record.total ??
        record.amount ??
        record.value ??
        record.price ??
        record.salary
    )
}

export function mapFinanceChartData(
    response: FinanceReportResponse | null | undefined
): FinanceChartPoint[] {
    return getFinanceRows(response).map((item) => {
        const record = toRecord(item)
        const date = getDateFromRecord(record)

        return {
            date,
            day: date,
            name: formatFinanceDateLabel(date),
            label: formatFinanceDateLabel(date),
            total: getTotalFromRecord(record),
            raw: item
        }
    })
}

export function normalizeIncomeCard(data: unknown): FinanceSummaryCard {
    const record = toRecord(data)

    return {
        total: toNumber(record.net_income ?? record.total),
        totalsub1: toNumber(record.total_sold ?? record.totalsub1),
        totalsub2: toNumber(record.total_spent ?? record.totalsub2),
        count: toNumber(record.count),
        average: toNumber(record.average),
        currencyCode: "PEN"
    }
}

export function normalizeExpensesCard(data: unknown): FinanceSummaryCard {
    const record = toRecord(data)

    return {
        total: toNumber(record.total),
        totalsub1: toNumber(record.total_staff ?? record.totalsub1),
        totalsub2: toNumber(record.total_orders ?? record.totalsub2),
        count: toNumber(record.count),
        average: toNumber(record.average),
        currencyCode: "PEN"
    }
}

export function normalizeReportRows(data: unknown): unknown[] {
    if (Array.isArray(data)) {
        return data
    }

    return getFinanceRows(toRecord(data))
}

export function normalizePendingRows(data: unknown): PendingRow[] {
    return mapPendingRows(data as PendingRowsResponse)
}

export function normalizePendingSummary(data: unknown): PendingSummary {
    return mapPendingSummary(data as PendingSummaryResponse)
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

export function getReportMeta(rows: unknown[]): {
    startDate: string
    endDate: string
    hasOlder: boolean
} {
    const firstRecord = toRecord(rows[0])
    const lastRecord = toRecord(rows[rows.length - 1])

    return {
        startDate: getDateFromRecord(firstRecord),
        endDate: getDateFromRecord(lastRecord),
        hasOlder: rows.length > 0
    }
}

export function mapFinanceSummaryCard(
    response: FinanceReportResponse | FinanceDaySummaryResponse | null | undefined,
    currencyCode: CurrencyCode | string
): FinanceSummaryCard {
    return getFinanceSummaryValues(response, currencyCode)
}

export function mapFinanceSummaryLabels(config: FinanceReportConfig): FinanceSummaryLabels {
    return {
        totalLabel: config.totalLabel,
        countLabel: config.countLabel,
        averageLabel: config.averageLabel
    }
}

function createEmptyPendingSummaryScope() {
    return {
        count: 0,
        total: 0
    }
}

function normalizePendingScope(value: unknown) {
    const record = toRecord(value)

    return {
        count: toNumber(record.count),
        total: toNumber(record.total)
    }
}

export function mapPendingSummary(
    response: PendingSummaryResponse | null | undefined
): PendingSummary {
    const responseRecord = toRecord(response)
    const dataRecord = toRecord(responseRecord.data)
    const summaryRecord = toRecord(responseRecord.summary)

    const source = Object.keys(summaryRecord).length
        ? summaryRecord
        : Object.keys(dataRecord).length
            ? dataRecord
            : responseRecord

    return {
        global: normalizePendingScope(source.global ?? createEmptyPendingSummaryScope()),
        sales: normalizePendingScope(source.sales ?? createEmptyPendingSummaryScope()),
        orders: normalizePendingScope(source.orders ?? createEmptyPendingSummaryScope()),
        staff: normalizePendingScope(source.staff ?? createEmptyPendingSummaryScope())
    }
}

export function mapPendingRows(response: PendingRowsResponse | null | undefined): PendingRow[] {
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

    if (Array.isArray(response.pending)) {
        return response.pending
    }

    return []
}

