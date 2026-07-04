import type { UserRow } from "../../types/person.types.js"

export function mapUser(row: UserRow): UserRow {
    return row
}

export function mapUsers(rows: UserRow[]): UserRow[] {
    return rows.map(mapUser)
}