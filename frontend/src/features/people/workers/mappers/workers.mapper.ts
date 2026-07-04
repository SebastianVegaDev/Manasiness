import { formatCurrency } from "@shared/utils/currency"

import type {
    PeopleCardItem,
    Person
} from "../../shared/types/people.types"
import type {
    PersonHistoryApiResponse,
    PersonHistoryDetail
} from "@shared/types/personHistory.types"

const FALLBACK_IMAGE = "https://i.postimg.cc/KYydTs9w/noimage.png"

type DetailResponse = Record<string, unknown>

function toRecord(value: unknown): DetailResponse {
    return value && typeof value === "object" ? value as DetailResponse : {}
}

function toArray(value: unknown): DetailResponse[] {
    return Array.isArray(value) ? value.map(toRecord) : []
}

function getPersonStatus(person: Person): string {
    if (typeof person.status === "string") return person.status
    if (typeof person.is_active === "boolean") return person.is_active ? "active" : "inactive"
    if (typeof person.isActive === "boolean") return person.isActive ? "active" : "inactive"

    return "active"
}

function getResponsePerson(response: unknown): DetailResponse {
    const record = toRecord(response)

    return toRecord(
        record.worker ??
        record.person ??
        record.user ??
        record.data ??
        response
    )
}

function getResponseRows(response: unknown): DetailResponse[] {
    const record = toRecord(response)
    const data = toRecord(record.data)

    return toArray(
        record.details ??
        record.rows ??
        record.staff ??
        data.details ??
        data.rows ??
        data.staff
    )
}

function getWindowLabel(response: unknown): string {
    const record = toRecord(response)
    const data = toRecord(record.data)

    return String(
        record.windowLabel ??
        record.window_label ??
        data.windowLabel ??
        data.window_label ??
        ""
    )
}

function getBoolean(response: unknown, camelKey: string, snakeKey: string): boolean {
    const record = toRecord(response)
    const data = toRecord(record.data)

    return Boolean(record[camelKey] ?? record[snakeKey] ?? data[camelKey] ?? data[snakeKey])
}

function getTotalPage(response: unknown): number {
    const record = toRecord(response)
    const data = toRecord(record.data)
    const totalPage = Number(
        record.totalPage ??
        record.total_page ??
        record.totalPages ??
        record.total_pages ??
        data.totalPage ??
        data.total_page ??
        data.totalPages ??
        data.total_pages ??
        0
    )

    return Number.isFinite(totalPage) ? totalPage : 0
}

export function mapWorkersToCards(workers: Person[] | null | undefined): PeopleCardItem[] {
    const safeWorkers = Array.isArray(workers) ? workers : []

    return safeWorkers.map((worker) => ({
        id: worker.id,
        name: worker.name,
        image: worker.image || FALLBACK_IMAGE,
        status: getPersonStatus(worker),
        details: [
            `Email: ${worker.email ?? "No email"}`,
            `Phone: ${worker.phone ?? "No phone"}`
        ]
    }))
}

export function mapWorkerToDetail(
    response: PersonHistoryApiResponse,
    currencyCode = "PEN"
): PersonHistoryDetail {
    const person = getResponsePerson(response)
    const rows = getResponseRows(response)

    return {
        name: String(person.name ?? ""),
        details: rows.map((row) => [
            String(row.date ?? row.created_at ?? row.createdAt ?? ""),
            formatCurrency(Number(row.salary ?? row.amount ?? row.total ?? 0), currencyCode),
            String(row.state ?? row.status ?? "")
        ]),
        windowLabel: getWindowLabel(response),
        hasOlder: getBoolean(response, "hasOlder", "has_older"),
        hasNewer: getBoolean(response, "hasNewer", "has_newer")
    }
}

export function mapWorkersTotalPage(response: PersonHistoryApiResponse): number {
    return getTotalPage(response)
}
