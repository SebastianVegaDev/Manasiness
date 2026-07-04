import { formatCurrency } from "@shared/utils/currency"

import type {
    PendingRow,
    PendingScope
} from "@features/finance/shared/types/finance.types"
import type { CurrencyCode } from "@shared/types/common.types"

type PendingTableProps = {
    scope: PendingScope
    rows: PendingRow[]
    currencyCode: CurrencyCode | string
    emptyMessage: string
    isLoading?: boolean
    isUpdating?: boolean
    onMarkAsPaid: (row: PendingRow) => void | Promise<void>
}

function parseDateValue(value: string | null | undefined): Date | null {
    if (!value) {
        return null
    }

    const normalizedValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? `${value}T00:00:00`
        : value

    const date = new Date(normalizedValue)

    return Number.isNaN(date.getTime()) ? null : date
}

function formatDate(value: string | null | undefined): string {
    const date = parseDateValue(value)

    if (!date) {
        return ""
    }

    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")

    return `${day}/${month}/${year} - ${hours}:${minutes}`
}

function getPersonName(row: PendingRow, scope: PendingScope): string {
    if (scope === "sales" || scope === "customers") {
        return String(row.customer ?? row.person ?? "")
    }

    if (scope === "orders" || scope === "suppliers") {
        return String(row.supplier ?? row.person ?? "")
    }

    return String(row.worker ?? row.person ?? "")
}

function getPersonLabel(scope: PendingScope): string {
    if (scope === "sales" || scope === "customers") {
        return "Customer"
    }

    if (scope === "orders" || scope === "suppliers") {
        return "Supplier"
    }

    return "Worker"
}

function getAmount(row: PendingRow): number {
    const value =
        row.amount ??
        row.total ??
        row.price ??
        row.salary ??
        0

    const numericValue = Number(value)

    return Number.isFinite(numericValue) ? numericValue : 0
}

function PendingTable({
    scope,
    rows,
    currencyCode,
    emptyMessage,
    isLoading = false,
    isUpdating = false,
    onMarkAsPaid
}: PendingTableProps) {
    const safeRows = Array.isArray(rows) ? rows : []

    if (isLoading) {
        return (
            <div className="pending-table-feedback">
                Loading...
            </div>
        )
    }

    if (!safeRows.length) {
        return (
            <div className="pending-table-feedback">
                {emptyMessage}
            </div>
        )
    }

    return (
        <div className="pending-table-wrapper">
            <table className="pending-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>{getPersonLabel(scope)}</th>
                        {scope !== "staff" && scope !== "workers" ? <th>Product</th> : null}
                        <th className="pending-table-align-right">Amount</th>
                        <th>State</th>
                        <th className="pending-table-align-right">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {safeRows.map((row) => (
                        <tr key={row.id}>
                            <td>
                                {formatDate(row.date ?? row.created_at ?? row.createdAt ?? null)}
                            </td>

                            <td>
                                {getPersonName(row, scope)}
                            </td>

                            {scope !== "staff" && scope !== "workers" ? (
                                <td>
                                    {String(row.product ?? "")}
                                </td>
                            ) : null}

                            <td className="pending-table-align-right">
                                {formatCurrency(getAmount(row), currencyCode)}
                            </td>

                            <td>
                                {String(row.state ?? "pending")}
                            </td>

                            <td className="pending-table-align-right">
                                <button
                                    type="button"
                                    className="pending-table-action"
                                    disabled={isUpdating}
                                    onClick={() => {
                                        void onMarkAsPaid(row)
                                    }}
                                >
                                    {isUpdating ? "Updating..." : "Mark as paid"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PendingTable
