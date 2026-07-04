import type { OrderRow } from "../../types/movement.types.js"

export function mapOrdersWindow(rows: OrderRow[]) {
    const firstRow = rows[0]

    return {
        rows,
        total_rows: Number(firstRow?.total_rows ?? 0),
        start_date: firstRow?.start_date ?? null,
        end_date: firstRow?.end_date ?? null,
        has_older: firstRow?.has_older ?? false,
        has_newer: firstRow?.has_newer ?? false
    }
}