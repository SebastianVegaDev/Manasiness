import {
    apiGet,
    apiPatch
} from "@shared/api/client"

import type { EntityId } from "@shared/types/common.types"
import type {
    FinanceDayParams,
    FinanceDaySummaryResponse,
    FinanceReportParams,
    FinanceReportResponse,
    PendingRowsResponse,
    PendingScope,
    PendingSummaryResponse
} from "../types/finance.types"
import type { QueryParamValue } from "@shared/types/api.types"

function sanitizeParams(params: Record<string, unknown> = {}): Record<string, QueryParamValue> {
    const sanitizedParams: Record<string, QueryParamValue> = {}

    for (const [key, value] of Object.entries(params)) {
        if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
        ) {
            sanitizedParams[key] = value
        }
    }

    return sanitizedParams
}

export async function getIncomeReport(
    params: FinanceReportParams = {}
): Promise<FinanceReportResponse> {
    return apiGet<FinanceReportResponse>("/income", {
        params: sanitizeParams(params)
    })
}

export async function getIncomePeriod(
    params: FinanceReportParams = {}
): Promise<FinanceReportResponse> {
    return getIncomeReport(params)
}

export async function getIncomeDaySummary(
    params: FinanceDayParams = {}
): Promise<FinanceDaySummaryResponse> {
    return apiGet<FinanceDaySummaryResponse>("/income/day", {
        params: sanitizeParams(params)
    })
}

export async function getIncomeDay(
    params: FinanceDayParams = {}
): Promise<FinanceDaySummaryResponse> {
    return getIncomeDaySummary(params)
}

export async function getExpensesReport(
    params: FinanceReportParams = {}
): Promise<FinanceReportResponse> {
    return apiGet<FinanceReportResponse>("/expenses", {
        params: sanitizeParams(params)
    })
}

export async function getExpensesPeriod(
    params: FinanceReportParams = {}
): Promise<FinanceReportResponse> {
    return getExpensesReport(params)
}

export async function getExpensesDaySummary(
    params: FinanceDayParams = {}
): Promise<FinanceDaySummaryResponse> {
    return apiGet<FinanceDaySummaryResponse>("/expenses/day", {
        params: sanitizeParams(params)
    })
}

export async function getExpensesDay(
    params: FinanceDayParams = {}
): Promise<FinanceDaySummaryResponse> {
    return getExpensesDaySummary(params)
}

export async function getPendingSummary(): Promise<PendingSummaryResponse> {
    return apiGet<PendingSummaryResponse>("/pending/summary")
}

export async function getPendingRows(scope: PendingScope): Promise<PendingRowsResponse> {
    return apiGet<PendingRowsResponse>(`/pending/${scope}`)
}

export async function markPendingAsPaid(
    scope: PendingScope,
    id: EntityId
): Promise<unknown> {
    return apiPatch<unknown, { state: "paid" }>(`/pending/${scope}/${id}`, {
        state: "paid"
    })
}

export async function updatePendingState({
    scope,
    id,
    state
}: {
    scope: string
    id: EntityId
    state: string
}): Promise<unknown> {
    return apiPatch<unknown, { state: string }>(`/pending/${scope}/${id}/state`, {
        state
    })
}

