import type {
    PendingRow,
    PendingSummary,
    PendingSummaryItem,
    PendingSummaryRow
} from "../../types/pending.types.js"

export function mapPendingSummaryItem(row: PendingSummaryRow | null): PendingSummaryItem {
    return {
        count: Number(row?.total_count ?? 0),
        total: Number(row?.total_amount ?? 0)
    }
}

export function mapPendingSummary(data: {
    customers: PendingSummaryRow | null
    suppliers: PendingSummaryRow | null
    workers: PendingSummaryRow | null
}): PendingSummary {
    const customers = mapPendingSummaryItem(data.customers)
    const suppliers = mapPendingSummaryItem(data.suppliers)
    const workers = mapPendingSummaryItem(data.workers)

    return {
        customers,
        suppliers,
        workers,
        sales: customers,
        orders: suppliers,
        staff: workers,
        global: {
            count: customers.count + suppliers.count + workers.count,
            total: customers.total + suppliers.total + workers.total
        }
    }
}

export function mapPendingRows(rows: PendingRow[]): PendingRow[] {
    return rows
}
