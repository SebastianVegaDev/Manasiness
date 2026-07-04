import type { PoolClient } from "pg"

import pool from "../../config/db.js"
import { createDevSeedData } from "../seeds/devSeed.js"
import { isDirectRun, runDatabaseScript } from "./scriptRunner.js"

type IdMap = Record<string, number>
type SeedProduct = {
    key: string
    costPrice: number
    salePrice: number
}

function requireId(map: IdMap, key: string, label: string): number {
    const id = map[key]

    if (!id) {
        throw new Error(`${label} not found: ${key}`)
    }

    return id
}

function requireProduct(products: readonly SeedProduct[], key: string): SeedProduct {
    const product = products.find((item) => item.key === key)

    if (!product) {
        throw new Error(`Product not found: ${key}`)
    }

    return product
}

async function upsertStore(client: PoolClient, store: {
    name: string
    email: string
    passwordHash: string
    phone: string
    currencyCode: string
    currencySymbol: string
    image: string
}): Promise<number> {
    const result = await client.query<{ id: number }>(`
        INSERT INTO stores (
            name,
            email,
            password_hash,
            phone,
            currency_code,
            currency_symbol,
            image
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (email)
        DO UPDATE SET
            name = EXCLUDED.name,
            password_hash = EXCLUDED.password_hash,
            phone = EXCLUDED.phone,
            currency_code = EXCLUDED.currency_code,
            currency_symbol = EXCLUDED.currency_symbol,
            image = EXCLUDED.image
        RETURNING id;
    `, [
        store.name,
        store.email,
        store.passwordHash,
        store.phone,
        store.currencyCode,
        store.currencySymbol,
        store.image
    ])

    const row = result.rows[0]

    if (!row) {
        throw new Error("Store seed failed")
    }

    return row.id
}

async function ensureDefaultUsers(client: PoolClient, storeId: number): Promise<void> {
    await client.query(`
        INSERT INTO users (store_id, name, phone, role, is_default)
        SELECT $1, default_users.name, NULL, default_users.role, TRUE
        FROM (
            VALUES
                ('Unknown Customer', 'customer'),
                ('Unknown Supplier', 'supplier'),
                ('Unknown Worker', 'worker')
        ) AS default_users(name, role)
        WHERE NOT EXISTS (
            SELECT 1
            FROM users
            WHERE users.store_id = $1
                AND users.role = default_users.role
                AND users.is_default = TRUE
        );
    `, [storeId])
}

async function upsertCategory(
    client: PoolClient,
    storeId: number,
    category: { name: string; image: string }
): Promise<number> {
    const existingResult = await client.query<{ id: number }>(`
        SELECT id
        FROM categories
        WHERE store_id = $1
            AND lower(name) = lower($2)
        LIMIT 1;
    `, [storeId, category.name])

    const existing = existingResult.rows[0]

    if (existing) {
        const updateResult = await client.query<{ id: number }>(`
            UPDATE categories
            SET name = $1,
                image = $2,
                is_active = TRUE
            WHERE id = $3 AND store_id = $4
            RETURNING id;
        `, [category.name, category.image, existing.id, storeId])

        const row = updateResult.rows[0]

        if (!row) {
            throw new Error("Category update seed failed")
        }

        return row.id
    }

    const result = await client.query<{ id: number }>(`
        INSERT INTO categories (store_id, name, image)
        VALUES ($1, $2, $3)
        RETURNING id;
    `, [storeId, category.name, category.image])

    const row = result.rows[0]

    if (!row) {
        throw new Error("Category seed failed")
    }

    return row.id
}

async function upsertUser(
    client: PoolClient,
    storeId: number,
    user: { name: string; image: string; phone: string; role: string }
): Promise<number> {
    const existingResult = await client.query<{ id: number }>(`
        SELECT id
        FROM users
        WHERE store_id = $1
            AND phone = $2
        LIMIT 1;
    `, [storeId, user.phone])

    const existing = existingResult.rows[0]

    if (existing) {
        const updateResult = await client.query<{ id: number }>(`
            UPDATE users
            SET name = $1,
                image = $2,
                role = $3,
                is_active = TRUE
            WHERE id = $4 AND store_id = $5
            RETURNING id;
        `, [user.name, user.image, user.role, existing.id, storeId])

        const row = updateResult.rows[0]

        if (!row) {
            throw new Error("User update seed failed")
        }

        return row.id
    }

    const result = await client.query<{ id: number }>(`
        INSERT INTO users (
            store_id,
            name,
            image,
            phone,
            role
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
    `, [storeId, user.name, user.image, user.phone, user.role])

    const row = result.rows[0]

    if (!row) {
        throw new Error("User seed failed")
    }

    return row.id
}

async function upsertProduct(
    client: PoolClient,
    storeId: number,
    product: {
        name: string
        image: string
        costPrice: number
        salePrice: number
        stock: number
    },
    categoryId: number
): Promise<number> {
    const existingResult = await client.query<{ id: number }>(`
        SELECT id
        FROM products
        WHERE store_id = $1
            AND lower(name) = lower($2)
        LIMIT 1;
    `, [storeId, product.name])

    const existing = existingResult.rows[0]

    if (existing) {
        const updateResult = await client.query<{ id: number }>(`
            UPDATE products
            SET category_id = $1,
                name = $2,
                image = $3,
                cost_price = $4,
                sale_price = $5,
                stock = $6,
                is_active = TRUE
            WHERE id = $7 AND store_id = $8
            RETURNING id;
        `, [
            categoryId,
            product.name,
            product.image,
            product.costPrice,
            product.salePrice,
            product.stock,
            existing.id,
            storeId
        ])

        const row = updateResult.rows[0]

        if (!row) {
            throw new Error("Product update seed failed")
        }

        return row.id
    }

    const result = await client.query<{ id: number }>(`
        INSERT INTO products (
            store_id,
            category_id,
            name,
            image,
            cost_price,
            sale_price,
            stock
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
    `, [
        storeId,
        categoryId,
        product.name,
        product.image,
        product.costPrice,
        product.salePrice,
        product.stock
    ])

    const row = result.rows[0]

    if (!row) {
        throw new Error("Product seed failed")
    }

    return row.id
}

async function clearDemoMovements(client: PoolClient, storeId: number): Promise<void> {
    await client.query("DELETE FROM sales WHERE store_id = $1;", [storeId])
    await client.query("DELETE FROM orders WHERE store_id = $1;", [storeId])
    await client.query("DELETE FROM staff WHERE store_id = $1;", [storeId])
}

export async function runSeed(): Promise<void> {
    const seed = await createDevSeedData()
    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        const storeId = await upsertStore(client, seed.store)

        await ensureDefaultUsers(client, storeId)

        const categoryIds: IdMap = {}

        for (const category of seed.categories) {
            categoryIds[category.key] = await upsertCategory(client, storeId, category)
        }

        const userIds: IdMap = {}

        for (const user of seed.users) {
            userIds[user.key] = await upsertUser(client, storeId, user)
        }

        const productIds: IdMap = {}

        for (const product of seed.products) {
            const categoryId = requireId(categoryIds, product.categoryKey, "Category")

            productIds[product.key] = await upsertProduct(client, storeId, product, categoryId)
        }

        await clearDemoMovements(client, storeId)

        for (const sale of seed.sales) {
            const product = requireProduct(seed.products, sale.productKey)

            await client.query(`
                INSERT INTO sales (
                    store_id,
                    product_id,
                    user_id,
                    sale_price,
                    quantity,
                    state
                )
                VALUES ($1, $2, $3, $4, $5, $6);
            `, [
                storeId,
                requireId(productIds, sale.productKey, "Product"),
                requireId(userIds, sale.userKey, "User"),
                product.salePrice,
                sale.quantity,
                sale.state
            ])
        }

        for (const order of seed.orders) {
            const product = requireProduct(seed.products, order.productKey)

            await client.query(`
                INSERT INTO orders (
                    store_id,
                    product_id,
                    user_id,
                    cost_price,
                    quantity,
                    state
                )
                VALUES ($1, $2, $3, $4, $5, $6);
            `, [
                storeId,
                requireId(productIds, order.productKey, "Product"),
                requireId(userIds, order.userKey, "User"),
                product.costPrice,
                order.quantity,
                order.state
            ])
        }

        for (const staff of seed.staff) {
            await client.query(`
                INSERT INTO staff (
                    store_id,
                    user_id,
                    salary,
                    state
                )
                VALUES ($1, $2, $3, $4);
            `, [
                storeId,
                requireId(userIds, staff.userKey, "User"),
                staff.salary,
                staff.state
            ])
        }

        await client.query("COMMIT")

        console.log("Seed user:")
        console.log(`Email: ${seed.store.email}`)
        console.log(`Password: ${seed.password}`)
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}

if (isDirectRun(import.meta.url)) {
    await runDatabaseScript(runSeed)
}
