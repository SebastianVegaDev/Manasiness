import type { CategoryOptionRow, CategoryRow } from "../../types/catalog.types.js"

export function mapCategory(row: CategoryRow): CategoryRow {
    return row
}

export function mapCategories(rows: CategoryRow[]): CategoryRow[] {
    return rows.map(mapCategory)
}

export function mapCategoryOption(row: CategoryOptionRow): CategoryOptionRow {
    return row
}

export function mapCategoryOptions(rows: CategoryOptionRow[]): CategoryOptionRow[] {
    return rows.map(mapCategoryOption)
}