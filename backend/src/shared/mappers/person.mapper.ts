import type { PersonBaseRow, PersonHistoryRow } from "../../types/person.types.js"
import type { TotalRowsRow, WindowInfoRow } from "../../types/history.types.js"
import { mapTotalRows, mapWindowInfo } from "./history-window.mapper.js"

export function mapPersonDetail(
    person: PersonBaseRow,
    rows: PersonHistoryRow[],
    totalRows: TotalRowsRow | null,
    windowInfo: WindowInfoRow | null
) {
    const mappedWindow = mapWindowInfo(windowInfo)

    return {
        ...person,
        rows,
        total_rows: mapTotalRows(totalRows),
        start_date: mappedWindow.start_date,
        end_date: mappedWindow.end_date,
        has_older: mappedWindow.has_older,
        has_newer: mappedWindow.has_newer
    }
}