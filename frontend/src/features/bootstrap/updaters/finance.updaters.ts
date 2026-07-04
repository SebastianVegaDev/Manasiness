import {
    hasRecordById,
    removeById,
    safeBootstrapData,
    upsertById
} from "./shared/bootstrapUpdater.utils"

import type {
    BootstrapData,
    BootstrapMovementRow,
    BootstrapPendingSummary,
    BootstrapPendingSummaryScope
} from "../shared/types/bootstrap.types"
import type { EntityId } from "@shared/types/common.types"

function toNumber(value: unknown): number {
    const amount = Number(value ?? 0)
    return Number.isFinite(amount) ? amount : 0
}

function getPendingAmount(record: BootstrapMovementRow): number {
    return toNumber(
        record.amount ??
        record.total ??
        record.price ??
        record.salary ??
        0
    )
}

function incrementScope(
    scope: BootstrapPendingSummaryScope | undefined,
    record: BootstrapMovementRow
): BootstrapPendingSummaryScope {
    const amount = getPendingAmount(record)

    return {
        ...scope,
        count: toNumber(scope?.count) + 1,
        total: toNumber(scope?.total) + amount
    }
}

function decrementScope(
    scope: BootstrapPendingSummaryScope | undefined,
    record: BootstrapMovementRow
): BootstrapPendingSummaryScope {
    const amount = getPendingAmount(record)

    return {
        ...scope,
        count: Math.max(toNumber(scope?.count) - 1, 0),
        total: Math.max(toNumber(scope?.total) - amount, 0)
    }
}

function incrementPendingSummary(
    summary: BootstrapPendingSummary | undefined,
    scope: string,
    record: BootstrapMovementRow
): BootstrapPendingSummary {
    return {
        ...summary,
        [scope]: incrementScope(summary?.[scope], record),
        global: incrementScope(summary?.global, record)
    }
}

function decrementPendingSummary(
    summary: BootstrapPendingSummary | undefined,
    scope: string,
    record: BootstrapMovementRow
): BootstrapPendingSummary {
    return {
        ...summary,
        [scope]: decrementScope(summary?.[scope], record),
        global: decrementScope(summary?.global, record)
    }
}

export function upsertBootstrapPendingRow(
    currentData: BootstrapData | null,
    scope: string,
    row: BootstrapMovementRow | null | undefined
): BootstrapData {
    const data = safeBootstrapData(currentData)

    if (!scope || !row?.id) {
        return data
    }

    const currentPending = data.pending ?? {}
    const currentRows = currentPending[scope]

    const rows = Array.isArray(currentRows) ? currentRows : []
    const alreadyExists = hasRecordById(rows, row.id)
    const nextSummary = alreadyExists
        ? currentPending.summary ?? {}
        : incrementPendingSummary(currentPending.summary, scope, row)
    const nextDashboardPending = alreadyExists
        ? data.dashboard?.pending ?? {}
        : incrementPendingSummary(data.dashboard?.pending, scope, row)

    return {
        ...data,
        pending: {
            ...currentPending,
            [scope]: upsertById(rows, row),
            summary: nextSummary
        },
        dashboard: {
            ...data.dashboard,
            pending: nextDashboardPending
        }
    }
}

export function removeBootstrapPendingRow(
    currentData: BootstrapData | null,
    scope: string,
    rowOrId: BootstrapMovementRow | EntityId | null | undefined
): BootstrapData {
    const data = safeBootstrapData(currentData)

    if (!scope || rowOrId === null || rowOrId === undefined) {
        return data
    }

    let row: BootstrapMovementRow | null = null
    let rowId: EntityId

    if (typeof rowOrId === "object") {
        row = rowOrId
        rowId = rowOrId.id
    } else {
        rowId = rowOrId
    }
    const currentPending = data.pending ?? {}
    const currentRows = currentPending[scope]
    const rows = Array.isArray(currentRows) ? currentRows : []
    const nextSummary = row
        ? decrementPendingSummary(currentPending.summary, scope, row)
        : currentPending.summary ?? {}
    const nextDashboardPending = row
        ? decrementPendingSummary(data.dashboard?.pending, scope, row)
        : data.dashboard?.pending ?? {}

    return {
        ...data,
        pending: {
            ...currentPending,
            [scope]: removeById(rows, rowId),
            summary: nextSummary
        },
        dashboard: {
            ...data.dashboard,
            pending: nextDashboardPending
        }
    }
}

export function replaceBootstrapPendingScope(
    currentData: BootstrapData | null,
    scope: string,
    rows: BootstrapMovementRow[] | null | undefined
): BootstrapData {
    const data = safeBootstrapData(currentData)

    if (!scope) {
        return data
    }

    return {
        ...data,
        pending: {
            ...data.pending,
            [scope]: Array.isArray(rows) ? rows : []
        }
    }
}

export function replaceBootstrapPendingSummary(
    currentData: BootstrapData | null,
    summary: BootstrapPendingSummary
): BootstrapData {
    const data = safeBootstrapData(currentData)

    return {
        ...data,
        pending: {
            ...data.pending,
            summary
        },
        dashboard: {
            ...data.dashboard,
            pending: summary
        }
    }
}

export function resolveBootstrapPendingItem(
    currentData: BootstrapData | null,
    scope: string,
    id: EntityId
): BootstrapData {
    return removeBootstrapPendingRow(currentData, scope, id)
}
