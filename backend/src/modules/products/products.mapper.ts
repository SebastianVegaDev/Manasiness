import type { ProductOptionRow, ProductRow } from "../../types/catalog.types.js"

export function mapProduct(row: ProductRow): ProductRow {
    return row
}

export function mapProducts(rows: ProductRow[]): ProductRow[] {
    return rows.map(mapProduct)
}

export function mapProductOptions(rows: ProductOptionRow[]): ProductOptionRow[] {
    return rows
}