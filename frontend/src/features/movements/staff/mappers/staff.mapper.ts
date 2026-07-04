import { formatCurrency } from "@shared/utils/currency"

import type { BootstrapOption } from "@features/bootstrap/shared/types/bootstrap.types"
import type { CurrencyCode } from "@shared/types/common.types"
import type {
    MovementApiWindowResponse,
    MovementFieldOption,
    MovementRecord,
    MovementTableRow
} from "../../shared/types/movement.types"

function parseDateValue(date: string | null | undefined): Date | null {
    if (!date) return null

    const normalizedDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
        ? `${date}T00:00:00`
        : date
    const parsedDate = new Date(normalizedDate)

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

function formatDateTime(date: string | null | undefined): string {
    const newDate = parseDateValue(date)

    if (!newDate) return ""

    const day = String(newDate.getDate()).padStart(2, "0")
    const month = String(newDate.getMonth() + 1).padStart(2, "0")
    const year = newDate.getFullYear()
    const hours = String(newDate.getHours()).padStart(2, "0")
    const minutes = String(newDate.getMinutes()).padStart(2, "0")

    return `${day}/${month}/${year} - ${hours}:${minutes}`
}

function getRows(data: MovementApiWindowResponse | null): MovementRecord[] {
    const rows = data?.rows ?? data?.data ?? []
    return Array.isArray(rows) ? rows : []
}

export function mapStaffToTables(
    data: MovementApiWindowResponse | null,
    currencyCode: CurrencyCode | string = "PEN"
): MovementTableRow[] {
    return getRows(data).map((item) => ({
        id: item.id,
        date: formatDateTime(item.date ?? item.created_at ?? item.createdAt ?? null),
        worker: String(item.worker ?? ""),
        salary: formatCurrency(item.salary, currencyCode),
        state: String(item.state ?? "")
    }))
}

export function mapStaffTotalPage(data: MovementApiWindowResponse | null): number {
    return Math.ceil(Number(data?.total_rows ?? data?.totalRows ?? 0) / 20)
}

export function mapStaffWindowLabel(data: MovementApiWindowResponse | null): string {
    if (!data?.start_date && !data?.startDate) return ""
    return formatDateTime(data.start_date ?? data.startDate ?? null)
}

export function mapStaffWindowState(data: MovementApiWindowResponse | null) {
    return {
        label: mapStaffWindowLabel(data),
        hasOlder: Boolean(data?.has_older ?? data?.hasOlder),
        hasNewer: Boolean(data?.has_newer ?? data?.hasNewer)
    }
}

export function mapWorkerOptions(data: BootstrapOption[] | null | undefined): MovementFieldOption[] {
    const safeData = Array.isArray(data) ? data : []

    return safeData.map((item) => {
        const isDefault = Boolean(item.is_default ?? item.isDefault)

        return {
            value: String(item.id),
            label: isDefault ? `${item.name} - Cash payment` : item.name,
            isDefault
        }
    })
}

