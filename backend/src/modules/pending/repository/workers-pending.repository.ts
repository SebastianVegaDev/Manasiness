import type { PoolClient } from "pg"

import pool from "../../../config/db.js"
import { conflict, notFound } from "../../../errors/http-errors.js"
import { withTransaction } from "../../../shared/db/transaction.js"
import type {
    PendingRecordRow,
    PendingRow,
    PendingSummaryRow,
    ResolvePendingData
} from "../../../types/pending.types.js"
import type { StoreScopedData } from "../../../types/history.types.js"

export async function findStaffPending(data: StoreScopedData): Promise<PendingRow[]> {
    const result = await pool.query<PendingRow>(`
        SELECT
            staff.id,
            users.name,
            users.name AS person,
            users.name AS worker,
            staff.salary AS amount,
            staff.created_at AS date,
            staff.created_at AS day_ago
        FROM staff
        JOIN users
            ON users.id = staff.user_id
            AND users.store_id = staff.store_id
        WHERE staff.store_id = $1
        AND staff.state = 'pending'
        AND users.role = 'worker'
        ORDER BY staff.created_at ASC;
    `, [data.storeId])

    return result.rows
}

export async function findStaffPendingSummary(data: StoreScopedData): Promise<PendingSummaryRow | null> {
    const result = await pool.query<PendingSummaryRow>(`
        SELECT
            COUNT(*) AS total_count,
            COALESCE(SUM(staff.salary), 0) AS total_amount
        FROM staff
        JOIN users
            ON users.id = staff.user_id
            AND users.store_id = staff.store_id
        WHERE staff.store_id = $1
        AND staff.state = 'pending'
        AND users.role = 'worker'
    `, [data.storeId])

    return result.rows[0] ?? null
}

async function resolveWorkerPendingWithClient(
    client: PoolClient,
    data: ResolvePendingData
): Promise<PendingRecordRow> {
    const staffResult = await client.query<PendingRecordRow>(`
        SELECT id, state
        FROM staff
        WHERE id = $1 AND store_id = $2
        FOR UPDATE
    `, [data.id, data.storeId])

    const staff = staffResult.rows[0]

    if (!staff) {
        throw notFound("Record not found")
    }

    if (staff.state !== "pending") {
        throw conflict("Action unavailable")
    }

    const updateResult = await client.query<PendingRecordRow>(`
        UPDATE staff
        SET state = $1,
            created_at = CASE
                WHEN $1 = 'paid' THEN CURRENT_TIMESTAMP
                ELSE created_at
            END
        WHERE id = $2 AND store_id = $3
        RETURNING id, state
    `, [data.state, data.id, data.storeId])

    const updated = updateResult.rows[0]

    if (!updated) {
        throw notFound("Record not found")
    }

    return updated
}

export async function resolveWorkerPending(data: ResolvePendingData): Promise<PendingRecordRow> {
    return withTransaction((client) => resolveWorkerPendingWithClient(client, data))
}
