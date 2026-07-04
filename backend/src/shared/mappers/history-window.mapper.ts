import type { TotalRowsRow, WindowInfoRow } from "../../types/history.types.js"

export function mapTotalRows(row: TotalRowsRow | null): number {
    return Number(row?.total_rows ?? 0)
}

export function mapWindowInfo(row: WindowInfoRow | null) {
    return {
        start_date: row?.start_date ?? null,
        end_date: row?.end_date ?? null,
        has_older: row?.has_older ?? false,
        has_newer: row?.has_newer ?? false
    }
}