import type {
    MovementApiWindowResponse,
    MovementHistoryParams,
    MovementWindowState
} from "../types/movement.types"

export const MOVEMENT_PAGE_SIZE = 10

export function getMovementRowOffset(page: number): number {
    return (page - 1) * MOVEMENT_PAGE_SIZE
}

export function getMovementTotalPage(totalRows: number | string | null | undefined): number {
    const safeTotalRows = Number(totalRows ?? 0)

    if (safeTotalRows <= 0) {
        return 1
    }

    return Math.ceil(safeTotalRows / MOVEMENT_PAGE_SIZE)
}

export function getMovementOrderDirection(sort: string): "ASC" | "DESC" {
    return sort === "oldest" ? "ASC" : "DESC"
}

export function createMovementWindowQuery({
    page,
    sort,
    dayOffset
}: {
    page: number
    sort: string
    dayOffset: number
}): MovementHistoryParams {
    return {
        page,
        sort,
        period: "day",
        limit: MOVEMENT_PAGE_SIZE,
        offset: dayOffset,
        dayOffset,
        rowOffset: getMovementRowOffset(page),
        orderDirection: getMovementOrderDirection(sort)
    }
}

export function normalizeMovementWindow(
    response: MovementApiWindowResponse | null | undefined
): MovementWindowState {
    const rows = response?.rows ?? response?.data ?? []

    return {
        rows: Array.isArray(rows) ? rows : [],
        totalRows: Number(response?.total_rows ?? response?.totalRows ?? 0),
        startDate: response?.start_date ?? response?.startDate ?? null,
        endDate: response?.end_date ?? response?.endDate ?? null,
        hasOlder: Boolean(response?.has_older ?? response?.hasOlder),
        hasNewer: Boolean(response?.has_newer ?? response?.hasNewer),
        raw: response ?? null
    }
}

