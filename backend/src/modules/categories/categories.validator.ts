import {
    parseOptionalImage,
    parseOptionalSearch,
    parseOptionalStatus,
    requireObject,
    requirePositiveInteger,
    requireText
} from "../../shared/validators/index.js"

export function validateCategoryFilters(query: Record<string, unknown>) {
    return {
        search: parseOptionalSearch(query.search, "search"),
        status: parseOptionalStatus(query.status, "status")
    }
}

export function validateCategoryId(params: Record<string, unknown>) {
    return {
        id: requirePositiveInteger(params.id, "id")
    }
}

export function validateCategoryPayload(body: unknown) {
    const data = requireObject(body)

    return {
        name: requireText(data.name, "name"),
        image: parseOptionalImage(data.image, "image")
    }
}