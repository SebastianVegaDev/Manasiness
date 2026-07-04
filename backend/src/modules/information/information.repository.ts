import pool from "../../config/db.js"
import type { StoreInformation } from "../../types/store.types.js"

type FindInformationData = {
    storeId: number
}

type UpdateInformationData = {
    storeId: number
    name: string
    email: string
    phone: string | null
    currency_code: string
    currency_symbol: string
    cleanImage: string
}

export async function findInformationStore(data: FindInformationData): Promise<StoreInformation | null> {
    const result = await pool.query<StoreInformation>(`
        SELECT name, email, phone, currency_code, currency_symbol, image
        FROM stores
        WHERE id = $1
    `, [data.storeId])

    return result.rows[0] ?? null
}

export async function updateInformationStore(data: UpdateInformationData): Promise<StoreInformation | null> {
    const result = await pool.query<StoreInformation>(`
        UPDATE stores
        SET
            name = $1,
            email = $2,
            phone = $3,
            currency_code = $4,
            currency_symbol = $5,
            image = $6
        WHERE id = $7
        RETURNING name, email, phone, currency_code, currency_symbol, image
    `, [
        data.name,
        data.email,
        data.phone,
        data.currency_code,
        data.currency_symbol,
        data.cleanImage,
        data.storeId
    ])

    return result.rows[0] ?? null
}