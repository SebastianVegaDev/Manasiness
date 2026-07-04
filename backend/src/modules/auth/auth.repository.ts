import pool from "../../config/db.js"
import type { AuthStoreRow, EmailCodeRow, StoreSessionRow } from "../../types/store.types.js"

type InsertStoreData = {
    name: string
    email: string
    passwordHash: string
    phone: string | null
    image: string
}

type InsertCodeData = {
    email: string
    codeHash: string
    expiresAt: Date
}

type UpdatePasswordData = {
    email: string
    passwordHash: string
}

export async function findStoreByEmail(email: string): Promise<AuthStoreRow | null> {
    const result = await pool.query<AuthStoreRow>(`
        SELECT id, name, email, password_hash, phone, currency_code, currency_symbol, image
        FROM stores
        WHERE email = $1
    `, [email])

    return result.rows[0] ?? null
}

export async function findStoreByPhone(phone: string): Promise<StoreSessionRow | null> {
    const result = await pool.query<StoreSessionRow>(`
        SELECT id, name, email, phone, currency_code, currency_symbol, image
        FROM stores
        WHERE phone = $1
    `, [phone])

    return result.rows[0] ?? null
}

export async function findStoreById(id: number): Promise<StoreSessionRow | null> {
    const result = await pool.query<StoreSessionRow>(`
        SELECT id, name, email, phone, currency_code, currency_symbol, image
        FROM stores
        WHERE id = $1
    `, [id])

    return result.rows[0] ?? null
}

export async function insertStore(data: InsertStoreData): Promise<StoreSessionRow | null> {
    const result = await pool.query<StoreSessionRow>(`
        INSERT INTO stores (name, email, password_hash, phone, image)
        VALUES($1, $2, $3, $4, $5)
        RETURNING id, name, email, phone, currency_code, currency_symbol, image
    `, [
        data.name,
        data.email,
        data.passwordHash,
        data.phone,
        data.image
    ])

    return result.rows[0] ?? null
}

export async function findEmailCode(email: string): Promise<EmailCodeRow | null> {
    const result = await pool.query<EmailCodeRow>(`
        SELECT email, code_hash, expires_at
        FROM email_verification_codes
        WHERE email = $1
    `, [email])

    return result.rows[0] ?? null
}

export async function insertEmailCode(data: InsertCodeData): Promise<{ email: string } | null> {
    const result = await pool.query<{ email: string }>(`
        INSERT INTO email_verification_codes (email, code_hash, expires_at)
        VALUES ($1, $2, $3)
        ON CONFLICT (email)
        DO UPDATE SET
            code_hash = $2,
            expires_at = $3,
            created_at = CURRENT_TIMESTAMP
        RETURNING email
    `, [data.email, data.codeHash, data.expiresAt])

    return result.rows[0] ?? null
}

export async function removeEmailCode(email: string): Promise<void> {
    await pool.query(`
        DELETE FROM email_verification_codes
        WHERE email = $1
    `, [email])
}

export async function findPasswordResetCode(email: string): Promise<EmailCodeRow | null> {
    const result = await pool.query<EmailCodeRow>(`
        SELECT email, code_hash, expires_at
        FROM password_reset_codes
        WHERE email = $1
    `, [email])

    return result.rows[0] ?? null
}

export async function insertPasswordResetCode(data: InsertCodeData): Promise<{ email: string } | null> {
    const result = await pool.query<{ email: string }>(`
        INSERT INTO password_reset_codes (email, code_hash, expires_at)
        VALUES ($1, $2, $3)
        ON CONFLICT (email)
        DO UPDATE SET
            code_hash = $2,
            expires_at = $3,
            created_at = CURRENT_TIMESTAMP
        RETURNING email
    `, [data.email, data.codeHash, data.expiresAt])

    return result.rows[0] ?? null
}

export async function removePasswordResetCode(email: string): Promise<void> {
    await pool.query(`
        DELETE FROM password_reset_codes
        WHERE email = $1
    `, [email])
}

export async function updateStorePasswordByEmail(data: UpdatePasswordData): Promise<StoreSessionRow | null> {
    const result = await pool.query<StoreSessionRow>(`
        UPDATE stores
        SET password_hash = $1
        WHERE email = $2
        RETURNING id, name, email, phone, currency_code, currency_symbol, image
    `, [data.passwordHash, data.email])

    return result.rows[0] ?? null
}