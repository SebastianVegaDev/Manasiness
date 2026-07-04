import "./PersonHistoryTable.css"

import type { PersonHistoryRow } from "@shared/types/personHistory.types"

type PersonHistoryTableProps = {
    rows?: PersonHistoryRow[]
    columns: string[]
    emptyMessage?: string
}

function PersonHistoryTable({ rows = [], columns, emptyMessage = "No records found" }: PersonHistoryTableProps) {
    const hasRows = Array.isArray(rows) && rows.length > 0

    return (
        <div className="shared-person-history">
            <div className="shared-person-history-table">
                <table>
                    <thead>
                        <tr>
                            {columns.map((item, index) => (
                                <th className="shared-person-table-head" key={index}>{item}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {!hasRows ? (
                            <tr>
                                <td className="shared-person-table-cell shared-person-table-cell-message" colSpan={columns.length || 1}>{emptyMessage}</td>
                            </tr>
                        ) : rows.map((item, index) => (
                            <tr key={index}>
                                {item.map((cell, cellIndex) => (
                                    <td className="shared-person-table-cell" key={`${index}-${cellIndex}`}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PersonHistoryTable
