import pool from "../../config/db.js"
import type { IdScopedData, StoreScopedData, TotalRowsRow, WindowInfoRow } from "../../types/history.types.js"
import type {
    PeopleFilterData,
    PersonBaseRow,
    PersonDetailData,
    PersonHistoryRow,
    UserOptionRow,
    UserRow
} from "../../types/person.types.js"

export async function findAllWorkers(data: PeopleFilterData): Promise<UserRow[]> {
    const cleanSearch = data.search.trim()
    const searchValue = `%${cleanSearch}%`
    const isActive = data.status === "active" ? true : data.status === "inactive" ? false : null

    const result = await pool.query<UserRow>(`
        SELECT id, name, image, phone, is_active, role
        FROM users
        WHERE role = 'worker'
            AND store_id = $1
            AND (
                $2 = ''
                OR name ILIKE $3
                OR phone ILIKE $3
            )
            AND ($4::boolean IS NULL OR is_active = $4)
        ORDER BY id ASC
    `, [data.storeId, cleanSearch, searchValue, isActive])

    return result.rows
}

export async function findWorkerBaseById(data: IdScopedData): Promise<PersonBaseRow | null> {
    const result = await pool.query<PersonBaseRow>(`
        SELECT id, name
        FROM users
        WHERE id = $1 AND role = 'worker' AND store_id = $2
    `, [data.id, data.storeId])

    return result.rows[0] ?? null
}

export async function findWorkerRowsById(data: PersonDetailData): Promise<PersonHistoryRow[]> {
    const result = await pool.query<PersonHistoryRow>(`
        SELECT
            staff.id,
            staff.created_at AS date,
            staff.salary,
            staff.state
        FROM staff
        WHERE staff.user_id = $1
            AND staff.store_id = $2
            AND staff.created_at >= (CURRENT_DATE - ($5 * INTERVAL '1 day'))
            AND staff.created_at < (CURRENT_DATE - ($5 * INTERVAL '1 day') + INTERVAL '1 day')
        ORDER BY staff.created_at ${data.orderDirection}
        LIMIT $3 OFFSET $4
    `, [data.id, data.storeId, data.limit, data.rowOffset, data.dayOffset])

    return result.rows
}

export async function getWorkerTotalRows(data: IdScopedData & { dayOffset: number }): Promise<TotalRowsRow | null> {
    const result = await pool.query<TotalRowsRow>(`
        SELECT COUNT(*) AS total_rows
        FROM staff
        WHERE user_id = $1
            AND store_id = $2
            AND created_at >= (CURRENT_DATE - ($3 * INTERVAL '1 day'))
            AND created_at < (CURRENT_DATE - ($3 * INTERVAL '1 day') + INTERVAL '1 day')
    `, [data.id, data.storeId, data.dayOffset])

    return result.rows[0] ?? null
}

export async function getWorkerWindowInfo(data: IdScopedData & { dayOffset: number }): Promise<WindowInfoRow | null> {
    const result = await pool.query<WindowInfoRow>(`
        SELECT
            target_day AS start_date,
            target_day AS end_date,
            EXISTS (
                SELECT 1
                FROM staff
                WHERE user_id = $1
                    AND store_id = $2
                    AND created_at < target_day
            ) AS has_older,
            ($3 > 0) AS has_newer
        FROM (
            SELECT (CURRENT_DATE - ($3 * INTERVAL '1 day'))::date AS target_day
        ) AS window_data
    `, [data.id, data.storeId, data.dayOffset])

    return result.rows[0] ?? null
}

export async function findActiveWorkersOptions(data: StoreScopedData): Promise<UserOptionRow[]> {
    const result = await pool.query<UserOptionRow>(`
        SELECT id, name, is_default
        FROM users
        WHERE role = 'worker' AND is_active = true AND store_id = $1
        ORDER BY is_default DESC, name
    `, [data.storeId])

    return result.rows
}