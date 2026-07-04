import pool from "../../config/db.js"
import type {
    UserMutationData,
    UserRow,
    UsersFilterData,
    UserStatusData,
    UserUpdateData
} from "../../types/person.types.js"
import type { IdScopedData, StoreScopedData } from "../../types/history.types.js"

export async function findAllUsers(data: UsersFilterData): Promise<UserRow[]> {
    const cleanSearch = data.search.trim()
    const searchValue = `%${cleanSearch}%`
    const isActive = data.status === "active" ? true : data.status === "inactive" ? false : null

    const result = await pool.query<UserRow>(`
        SELECT id, name, image, phone, role, created_at, is_active
        FROM users
        WHERE store_id = $1
            AND (
                $2 = ''
                OR name ILIKE $3
                OR phone ILIKE $3
                OR role ILIKE $3
            )
            AND ($4::boolean IS NULL OR is_active = $4)
            AND ($5 = 'all' OR role = $5)
        ORDER BY id ASC
    `, [data.storeId, cleanSearch, searchValue, isActive, data.role])

    return result.rows
}

export async function findUserById(data: IdScopedData): Promise<UserRow | null> {
    const result = await pool.query<UserRow>(`
        SELECT id, name, image, phone, role, is_default, created_at, updated_at, is_active
        FROM users
        WHERE id = $1 AND store_id = $2
    `, [data.id, data.storeId])

    return result.rows[0] ?? null
}

export async function findUserByPhone(data: StoreScopedData & { phone: string }): Promise<UserRow | null> {
    const result = await pool.query<UserRow>(`
        SELECT id, name, image, phone, role, is_default, created_at, updated_at, is_active
        FROM users
        WHERE phone = $1 AND store_id = $2
    `, [data.phone, data.storeId])

    return result.rows[0] ?? null
}

export async function insertUser(data: UserMutationData): Promise<UserRow | null> {
    const result = await pool.query<UserRow>(`
        INSERT INTO users (name, image, phone, role, store_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, image, phone, role, is_default, created_at, updated_at, is_active
    `, [data.name, data.image, data.phone, data.role, data.storeId])

    return result.rows[0] ?? null
}

export async function updateUserById(data: UserUpdateData): Promise<UserRow | null> {
    const result = await pool.query<UserRow>(`
        UPDATE users
        SET name = $1,
            image = $2,
            phone = $3,
            role = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5 AND store_id = $6
        RETURNING id, name, image, phone, role, is_default, created_at, updated_at, is_active
    `, [data.name, data.image, data.phone, data.role, data.id, data.storeId])

    return result.rows[0] ?? null
}

export async function updateUserStatus(data: UserStatusData): Promise<UserRow | null> {
    const result = await pool.query<UserRow>(`
        UPDATE users
        SET is_active = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND store_id = $3
        RETURNING id, name, image, phone, role, is_default, created_at, updated_at, is_active
    `, [data.isActive, data.id, data.storeId])

    return result.rows[0] ?? null
}