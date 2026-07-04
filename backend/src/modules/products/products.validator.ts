import {
    parseOptionalImage,
    parseOptionalPositiveInteger,
    parseOptionalSearch,
    parseOptionalStatus,
    requireNonNegativeNumber,
    requireObject,
    requirePositiveInteger,
    requirePositiveNumber,
    requireText
} from "../../shared/validators/index.js"

export function validateProductFilters(query: Record<string, unknown>) {
    return {
        search: parseOptionalSearch(query.search, "search"),
        status: parseOptionalStatus(query.status, "status"),
        categoryId: parseOptionalPositiveInteger(query.categoryId, "categoryId")
    }
}

export function validateProductId(params: Record<string, unknown>) {
    return {
        id: requirePositiveInteger(params.id, "id")
    }
}

export function validateProductPayload(body: unknown) {
    const data = requireObject(body)

    return {
        categoryId: requirePositiveInteger(data.category_id, "category_id"),
        name: requireText(data.name, "name"),
        image: parseOptionalImage(data.image, "image"),
        costPrice: requirePositiveNumber(data.cost_price, "cost_price"),
        salePrice: requirePositiveNumber(data.sale_price, "sale_price"),
        stock: requireNonNegativeNumber(data.stock, "stock")
    }
}