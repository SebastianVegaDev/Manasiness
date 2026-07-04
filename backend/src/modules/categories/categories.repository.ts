import pool from "../../config/db.js"
import type {
    CatalogFilterData,
    CategoryMutationData,
    CategoryOptionRow,
    CategoryRow,
    CategoryStatusData,
    CategoryUpdateData
} from "../../types/catalog.types.js"
import type { IdScopedData, StoreScopedData } from "../../types/history.types.js"

export async function findAllCategories(data: CatalogFilterData): Promise<CategoryRow[]> {
    const cleanSearch = data.search.trim()
    const searchValue = `%${cleanSearch}%`
    const isActive = data.status === "active" ? true : data.status === "inactive" ? false : null

    const result = await pool.query<CategoryRow>(`
        SELECT id, name, image, created_at, updated_at, is_active
        FROM categories
        WHERE store_id = $1
            AND (
                $2 = ''
                OR name ILIKE $3
            )
            AND ($4::boolean IS NULL OR is_active = $4)
        ORDER BY id ASC
    `, [data.storeId, cleanSearch, searchValue, isActive])

    return result.rows
}

export async function findCategoryById(data: IdScopedData): Promise<CategoryRow | null> {
    const result = await pool.query<CategoryRow>(`
        SELECT id, name, image, created_at, updated_at, is_active
        FROM categories
        WHERE id = $1 AND store_id = $2
    `, [data.id, data.storeId])

    return result.rows[0] ?? null
}

export async function findCategoryByName(data: StoreScopedData & { name: string }): Promise<CategoryRow | null> {
    const result = await pool.query<CategoryRow>(`
        SELECT id, name, image, created_at, updated_at, is_active
        FROM categories
        WHERE lower(name) = lower($1) AND store_id = $2
    `, [data.name, data.storeId])

    return result.rows[0] ?? null
}

export async function insertCategory(data: CategoryMutationData): Promise<CategoryRow | null> {
    const result = await pool.query<CategoryRow>(`
        INSERT INTO categories (name, image, store_id)
        VALUES ($1, $2, $3)
        RETURNING id, name, image, created_at, updated_at, is_active
    `, [data.name, data.image, data.storeId])

    return result.rows[0] ?? null
}

export async function updateCategoryById(data: CategoryUpdateData): Promise<CategoryRow | null> {
    const result = await pool.query<CategoryRow>(`
        UPDATE categories
        SET name = $1,
            image = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3 AND store_id = $4
        RETURNING id, name, image, created_at, updated_at, is_active
    `, [data.name, data.image, data.id, data.storeId])

    return result.rows[0] ?? null
}

export async function updateCategoryStatus(data: CategoryStatusData): Promise<CategoryRow | null> {
    const result = await pool.query<CategoryRow>(`
        UPDATE categories
        SET is_active = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND store_id = $3
        RETURNING id, name, image, created_at, updated_at, is_active
    `, [data.isActive, data.id, data.storeId])

    return result.rows[0] ?? null
}

export async function findActiveCategoryOptions(data: StoreScopedData): Promise<CategoryOptionRow[]> {
    const result = await pool.query<CategoryOptionRow>(`
        SELECT id, name
        FROM categories
        WHERE is_active = true AND store_id = $1
        ORDER BY name
    `, [data.storeId])

    return result.rows
}