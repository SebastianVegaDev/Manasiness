import pool from "../../config/db.js"

type StorePasswordRow = {
    password_hash: string
}

type StoreIdRow = {
    id: number
}

type StoreScopedData = {
    storeId: number
}

type UpdatePasswordData = StoreScopedData & {
    passwordHash: string
}

export async function findPasswordById(data: StoreScopedData): Promise<StorePasswordRow | null> {
    const result = await pool.query<StorePasswordRow>(`
        SELECT password_hash
        FROM stores
        WHERE id = $1
    `, [data.storeId])

    return result.rows[0] ?? null
}

export async function updatePassword(data: UpdatePasswordData): Promise<StoreIdRow | null> {
    const result = await pool.query<StoreIdRow>(`
        UPDATE stores
        SET password_hash = $1
        WHERE id = $2
        RETURNING id
    `, [data.passwordHash, data.storeId])

    return result.rows[0] ?? null
}