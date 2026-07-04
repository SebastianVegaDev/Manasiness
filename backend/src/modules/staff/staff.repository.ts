import type { PoolClient } from "pg"

import pool from "../../config/db.js"
import type { StoreScopedData } from "../../types/history.types.js"
import type {
    CreateStaffData,
    StaffRow,
    UserMovementLookupRow
} from "../../types/movement.types.js"

export async function findAllStaff(data: {
    storeId: number
    limit: number
    rowOffset: number
    dayOffset: number
    orderDirection: "ASC" | "DESC"
}): Promise<StaffRow[]> {
    const result = await pool.query<StaffRow>(`
        WITH target_window AS (
            SELECT
                (CURRENT_DATE - ($4 * INTERVAL '1 day'))::date AS start_date,
                (CURRENT_DATE - ($4 * INTERVAL '1 day'))::date AS end_date
        ),
        filtered_staff AS (
            SELECT
                staff.id,
                staff.created_at AS date,
                users.name AS worker,
                staff.salary,
                staff.state,
                target_window.start_date,
                target_window.end_date
            FROM staff
            JOIN users ON users.id = staff.user_id
                AND users.store_id = staff.store_id
            CROSS JOIN target_window
            WHERE staff.store_id = $1
                AND staff.created_at >= target_window.start_date
                AND staff.created_at < target_window.start_date + INTERVAL '1 day'
        ),
        counted_staff AS (
            SELECT COUNT(*) AS total_rows
            FROM filtered_staff
        ),
        window_info AS (
            SELECT
                EXISTS (
                    SELECT 1
                    FROM staff
                    CROSS JOIN target_window
                    WHERE staff.store_id = $1
                        AND staff.created_at < target_window.start_date
                ) AS has_older,
                ($4 > 0) AS has_newer
        )
        SELECT
            filtered_staff.*,
            counted_staff.total_rows,
            window_info.has_older,
            window_info.has_newer
        FROM filtered_staff
        CROSS JOIN counted_staff
        CROSS JOIN window_info
        ORDER BY filtered_staff.date ${data.orderDirection}
        LIMIT $2 OFFSET $3
    `, [
        data.storeId,
        data.limit,
        data.rowOffset,
        data.dayOffset
    ])

    return result.rows
}

export async function findUserForStaff(
    client: PoolClient,
    data: StoreScopedData & { userId: number }
): Promise<UserMovementLookupRow | null> {
    const result = await client.query<UserMovementLookupRow>(`
        SELECT id, name, role, is_default, is_active
        FROM users
        WHERE id = $1 AND store_id = $2
    `, [data.userId, data.storeId])

    return result.rows[0] ?? null
}

export async function insertStaff(
    client: PoolClient,
    data: CreateStaffData
): Promise<StaffRow | null> {
    const result = await client.query<StaffRow>(`
        WITH inserted_staff AS (
            INSERT INTO staff (
                store_id,
                user_id,
                salary,
                state
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
        )
        SELECT
            inserted_staff.id,
            inserted_staff.created_at AS date,
            users.name AS worker,
            inserted_staff.salary,
            inserted_staff.state
        FROM inserted_staff
        JOIN users ON users.id = inserted_staff.user_id
            AND users.store_id = inserted_staff.store_id
    `, [
        data.storeId,
        data.userId,
        data.salary,
        data.state
    ])

    return result.rows[0] ?? null
}