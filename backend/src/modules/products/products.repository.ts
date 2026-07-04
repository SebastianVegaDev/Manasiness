import pool from "../../config/db.js"
import type {
    ProductFilterData,
    ProductMutationData,
    ProductOptionRow,
    ProductRow,
    ProductStatusData,
    ProductUpdateData
} from "../../types/catalog.types.js"
import type { IdScopedData, StoreScopedData } from "../../types/history.types.js"

export async function findAllProducts(data: ProductFilterData): Promise<ProductRow[]> {
    const cleanSearch = data.search.trim()
    const searchValue = `%${cleanSearch}%`
    const isActive = data.status === "active" ? true : data.status === "inactive" ? false : null

    const result = await pool.query<ProductRow>(`
        SELECT
            products.id,
            products.category_id,
            products.name,
            products.image,
            products.cost_price,
            products.sale_price,
            products.stock,
            products.is_active,
            categories.name AS category
        FROM products
        JOIN categories ON products.category_id = categories.id AND products.store_id = categories.store_id
        WHERE products.store_id = $1
            AND (
                $2 = ''
                OR products.name ILIKE $3
                OR categories.name ILIKE $3
            )
            AND ($4::boolean IS NULL OR products.is_active = $4)
            AND ($5::integer IS NULL OR products.category_id = $5)
        ORDER BY products.id ASC
    `, [data.storeId, cleanSearch, searchValue, isActive, data.categoryId])

    return result.rows
}

export async function findProductById(data: IdScopedData): Promise<ProductRow | null> {
    const result = await pool.query<ProductRow>(`
        SELECT
            products.id,
            products.category_id,
            products.name,
            products.image,
            products.cost_price,
            products.sale_price,
            products.stock,
            products.created_at,
            products.updated_at,
            products.is_active,
            categories.name AS category
        FROM products
        JOIN categories ON categories.id = products.category_id AND categories.store_id = products.store_id
        WHERE products.id = $1 AND products.store_id = $2
    `, [data.id, data.storeId])

    return result.rows[0] ?? null
}

export async function findProductByName(data: StoreScopedData & { name: string }): Promise<ProductRow | null> {
    const result = await pool.query<ProductRow>(`
        SELECT id, name, category_id, image, cost_price, sale_price, stock, is_active
        FROM products
        WHERE lower(name) = lower($1) AND store_id = $2
    `, [data.name, data.storeId])

    return result.rows[0] ?? null
}

export async function insertProduct(data: ProductMutationData): Promise<ProductRow | null> {
    const result = await pool.query<ProductRow>(`
        WITH inserted_product AS (
            INSERT INTO products (
                category_id,
                name,
                image,
                cost_price,
                sale_price,
                stock,
                store_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        )
        SELECT
            inserted_product.id,
            inserted_product.category_id,
            inserted_product.name,
            inserted_product.image,
            inserted_product.cost_price,
            inserted_product.sale_price,
            inserted_product.stock,
            inserted_product.created_at,
            inserted_product.updated_at,
            inserted_product.is_active,
            categories.name AS category
        FROM inserted_product
        JOIN categories ON categories.id = inserted_product.category_id
            AND categories.store_id = inserted_product.store_id
    `, [
        data.categoryId,
        data.name,
        data.image,
        data.costPrice,
        data.salePrice,
        data.stock,
        data.storeId
    ])

    return result.rows[0] ?? null
}

export async function updateProductById(data: ProductUpdateData): Promise<ProductRow | null> {
    const result = await pool.query<ProductRow>(`
        WITH updated_product AS (
            UPDATE products
            SET category_id = $1,
                name = $2,
                image = $3,
                cost_price = $4,
                sale_price = $5,
                stock = $6,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $7 AND store_id = $8
            RETURNING *
        )
        SELECT
            updated_product.id,
            updated_product.category_id,
            updated_product.name,
            updated_product.image,
            updated_product.cost_price,
            updated_product.sale_price,
            updated_product.stock,
            updated_product.created_at,
            updated_product.updated_at,
            updated_product.is_active,
            categories.name AS category
        FROM updated_product
        JOIN categories ON categories.id = updated_product.category_id
            AND categories.store_id = updated_product.store_id
    `, [
        data.categoryId,
        data.name,
        data.image,
        data.costPrice,
        data.salePrice,
        data.stock,
        data.id,
        data.storeId
    ])

    return result.rows[0] ?? null
}

export async function updateProductStatus(data: ProductStatusData): Promise<ProductRow | null> {
    const result = await pool.query<ProductRow>(`
        WITH updated_product AS (
            UPDATE products
            SET is_active = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2 AND store_id = $3
            RETURNING *
        )
        SELECT
            updated_product.id,
            updated_product.category_id,
            updated_product.name,
            updated_product.image,
            updated_product.cost_price,
            updated_product.sale_price,
            updated_product.stock,
            updated_product.created_at,
            updated_product.updated_at,
            updated_product.is_active,
            categories.name AS category
        FROM updated_product
        JOIN categories ON categories.id = updated_product.category_id
            AND categories.store_id = updated_product.store_id
    `, [data.isActive, data.id, data.storeId])

    return result.rows[0] ?? null
}

export async function findActiveProductOptions(data: StoreScopedData): Promise<ProductOptionRow[]> {
    const result = await pool.query<ProductOptionRow>(`
        SELECT id, name
        FROM products
        WHERE is_active = true AND store_id = $1
        ORDER BY name
    `, [data.storeId])

    return result.rows
}