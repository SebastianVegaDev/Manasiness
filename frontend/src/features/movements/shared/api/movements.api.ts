import { apiGet, apiPost } from "@shared/api/client"

import type {
    MovementApiWindowResponse,
    MovementHistoryParams,
    MovementPayload
} from "../types/movement.types"

function buildMovementQuery(params: MovementHistoryParams = {}): string {
    const query = new URLSearchParams({
        sort: String(params.sort ?? "recent"),
        page: String(params.page ?? 1),
        offset: String(params.offset ?? params.dayOffset ?? 0),
        period: String(params.period ?? "day"),
        limit: String(params.limit ?? 10)
    })

    return query.toString()
}

export async function getSalesHistory(
    params: MovementHistoryParams = {}
): Promise<MovementApiWindowResponse> {
    return apiGet<MovementApiWindowResponse>(`/sales?${buildMovementQuery(params)}`)
}

export async function createSale(payload: MovementPayload): Promise<unknown> {
    return apiPost<unknown, MovementPayload>("/sales/create", payload)
}

export async function getOrdersHistory(
    params: MovementHistoryParams = {}
): Promise<MovementApiWindowResponse> {
    return apiGet<MovementApiWindowResponse>(`/orders?${buildMovementQuery(params)}`)
}

export async function createOrder(payload: MovementPayload): Promise<unknown> {
    return apiPost<unknown, MovementPayload>("/orders/create", payload)
}

export async function getStaffHistory(
    params: MovementHistoryParams = {}
): Promise<MovementApiWindowResponse> {
    return apiGet<MovementApiWindowResponse>(`/staff?${buildMovementQuery(params)}`)
}

export async function createStaff(payload: MovementPayload): Promise<unknown> {
    return apiPost<unknown, MovementPayload>("/staff/create", payload)
}

