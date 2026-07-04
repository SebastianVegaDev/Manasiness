import {
    hasRecordById,
    limitList,
    safeBootstrapData,
    upsertById
} from "./shared/bootstrapUpdater.utils"

import type {
    BootstrapData,
    BootstrapInitialWindow,
    BootstrapMovementRow,
    BootstrapStat
} from "../shared/types/bootstrap.types"

const DEFAULT_INITIAL_WINDOW_LIMIT = 10

function toNumber(value: unknown): number {
    const amount = Number(value ?? 0)
    return Number.isFinite(amount) ? amount : 0
}

function getMovementAmount(record: BootstrapMovementRow): number {
    return toNumber(
        record.amount ??
        record.total ??
        record.price ??
        record.salary ??
        0
    )
}

function incrementStats(
    stats: BootstrapStat | undefined,
    record: BootstrapMovementRow
): BootstrapStat {
    const amount = getMovementAmount(record)

    return {
        ...stats,
        count: toNumber(stats?.count) + 1,
        total: toNumber(stats?.total) + amount
    }
}

export function upsertBootstrapInitialWindowItem(
    currentData: BootstrapData | null,
    windowKey: string,
    item: BootstrapMovementRow | null | undefined
): BootstrapData {
    const data = safeBootstrapData(currentData)

    if (!windowKey || !item?.id) {
        return data
    }

    const currentWindow = data.initialWindows?.[windowKey] ?? {}
    const currentRows = currentWindow.rows ?? currentWindow.data ?? []
    const alreadyExists = hasRecordById(currentRows, item.id)

    const currentTotalRows = toNumber(currentWindow.total_rows ?? currentWindow.totalRows)

    return {
        ...data,
        initialWindows: {
            ...data.initialWindows,
            [windowKey]: {
                ...currentWindow,
                rows: limitList(
                    upsertById(currentRows, item),
                    DEFAULT_INITIAL_WINDOW_LIMIT
                ),
                total_rows: alreadyExists ? currentTotalRows : currentTotalRows + 1
            }
        }
    }
}

export function upsertBootstrapStats(
    currentData: BootstrapData | null,
    statsKey: string,
    record: BootstrapMovementRow | null | undefined
): BootstrapData {
    const data = safeBootstrapData(currentData)

    if (!statsKey || !record) {
        return data
    }

    return {
        ...data,
        dashboard: {
            ...data.dashboard,
            stats: {
                ...data.dashboard?.stats,
                [statsKey]: incrementStats(data.dashboard?.stats?.[statsKey], record)
            }
        }
    }
}






export function updateBootstrapInitialWindow(
    currentData: BootstrapData | null,
    windowKey: string,
    latestWindow: unknown
): BootstrapData {
    const data = safeBootstrapData(currentData)

    if (!windowKey || !latestWindow || typeof latestWindow !== "object") {
        return data
    }

    return {
        ...data,
        initialWindows: {
            ...data.initialWindows,
            [windowKey]: latestWindow as BootstrapInitialWindow
        }
    }
}
