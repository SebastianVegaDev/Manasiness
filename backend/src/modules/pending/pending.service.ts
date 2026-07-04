import { badRequest } from "../../errors/http-errors.js"
import type {
    PendingRecordRow,
    PendingRow,
    PendingScope,
    PendingSummary,
    ResolvePendingData
} from "../../types/pending.types.js"
import type { StoreScopedData } from "../../types/history.types.js"
import { mapPendingRows, mapPendingSummary } from "./pending.mapper.js"
import {
    findCustomersPending,
    findCustomersPendingSummary,
    findStaffPending,
    findStaffPendingSummary,
    findSuppliersPending,
    findSuppliersPendingSummary,
    resolveCustomerPending,
    resolveSupplierPending,
    resolveWorkerPending
} from "./repository/index.js"

export async function getPendingSummaryData(data: StoreScopedData): Promise<PendingSummary> {
    const [customers, suppliers, workers] = await Promise.all([
        findCustomersPendingSummary(data),
        findSuppliersPendingSummary(data),
        findStaffPendingSummary(data)
    ])

    return mapPendingSummary({
        customers,
        suppliers,
        workers
    })
}

export async function getUsersPending(data: StoreScopedData & { scope: PendingScope }): Promise<PendingRow[]> {
    if (data.scope === "customers" || data.scope === "sales") {
        return mapPendingRows(await findCustomersPending(data))
    }

    if (data.scope === "suppliers" || data.scope === "orders") {
        return mapPendingRows(await findSuppliersPending(data))
    }

    if (data.scope === "workers" || data.scope === "staff") {
        return mapPendingRows(await findStaffPending(data))
    }

    throw badRequest("Scope invalid")
}

export async function resolvePendingItem(data: ResolvePendingData): Promise<PendingRecordRow> {
    if (data.scope === "customers" || data.scope === "sales") {
        return resolveCustomerPending(data)
    }

    if (data.scope === "suppliers" || data.scope === "orders") {
        return resolveSupplierPending(data)
    }

    if (data.scope === "workers" || data.scope === "staff") {
        return resolveWorkerPending(data)
    }

    throw badRequest("Scope invalid")
}
