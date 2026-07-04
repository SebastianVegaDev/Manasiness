import "./DataTable.css"

import type { ReactNode } from "react"
import type { TableHistoryColumn, TableHistoryRow } from "@shared/types/tableHistory.types"

type DataTableProps = {
    rows?: TableHistoryRow[]
    columns?: TableHistoryColumn[]
    emptyMessage?: string
}

function formatCellValue(value: unknown) {
    if (value === null || value === undefined) return ""
    return value as ReactNode
}

function DataTable({ rows = [], columns = [], emptyMessage = "No records found" }: DataTableProps) {
    const safeRows = Array.isArray(rows) ? rows : []
    const safeColumns = Array.isArray(columns) ? columns : []

    if (!safeRows.length) {
        return (
            <div className="shared-data-table shared-data-table--empty">
                <div className="shared-data-table-empty-state">
                    <span className="shared-data-table-empty-label">History is clear</span>
                    <h3>{emptyMessage}</h3>
                    <p>New records will appear here with their date, amount and current state.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="shared-data-table">
            <table>
                <thead>
                    <tr>
                        {safeColumns.map((column) => (
                            <th key={column.key} className="shared-data-table-head">
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {safeRows.map((item) => (
                        <tr key={item.id}>
                            {safeColumns.map((column) => (
                                <td key={column.key} className="shared-data-table-cell">
                                    {column.render ? column.render(item) : formatCellValue(item[column.key])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DataTable
