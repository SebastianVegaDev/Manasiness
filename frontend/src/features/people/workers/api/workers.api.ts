import { apiGet } from "@shared/api/client"

import type {
    PeopleListParams,
    Person
} from "../../shared/types/people.types"
import type { EntityId } from "@shared/types/common.types"
import type {
    PersonHistoryApiParams,
    PersonHistoryApiResponse
} from "@shared/types/personHistory.types"
import type { QueryParamValue } from "@shared/types/api.types"

type WorkerListResponse =
    | Person[]
    | {
        rows?: Person[]
        data?: Person[]
        workers?: Person[]
    }

type WorkerResponse =
    | PersonHistoryApiResponse
    | {
        data?: PersonHistoryApiResponse
        worker?: PersonHistoryApiResponse
    }

function toRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" ? value as Record<string, unknown> : {}
}

function sanitizeParams(params: PeopleListParams | PersonHistoryApiParams = {}): Record<string, QueryParamValue> {
    const sanitizedParams: Record<string, QueryParamValue> = {}

    for (const [key, value] of Object.entries(params)) {
        if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
        ) {
            sanitizedParams[key] = value
        }
    }

    return sanitizedParams
}

function unwrapWorkerList(response: WorkerListResponse): Person[] {
    if (Array.isArray(response)) {
        return response
    }

    const responseRecord = toRecord(response)

    if (Array.isArray(responseRecord.rows)) return responseRecord.rows as Person[]
    if (Array.isArray(responseRecord.data)) return responseRecord.data as Person[]
    if (Array.isArray(responseRecord.workers)) return responseRecord.workers as Person[]

    return []
}

function unwrapWorker(response: WorkerResponse): PersonHistoryApiResponse {
    const responseRecord = toRecord(response)

    return (
        responseRecord.worker as PersonHistoryApiResponse ??
        responseRecord.data as PersonHistoryApiResponse ??
        response as PersonHistoryApiResponse
    )
}

export async function getWorkers(params: PeopleListParams = {}): Promise<Person[]> {
    const response = await apiGet<WorkerListResponse>("/workers", {
        params: sanitizeParams(params)
    })

    return unwrapWorkerList(response)
}

export async function getWorkerById(
    id: EntityId,
    params: PersonHistoryApiParams = {}
): Promise<PersonHistoryApiResponse> {
    const response = await apiGet<WorkerResponse>(`/workers/${id}`, {
        params: sanitizeParams(params)
    })

    return unwrapWorker(response)
}



