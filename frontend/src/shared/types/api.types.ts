export type ApiErrorResponse = {
    message?: string
    error?: string
}

export type ApiListResponse<T> = {
    rows?: T[]
    data?: T[]
    total_rows?: number | string
    totalRows?: number | string
}

export type ApiSuccessResponse<T> = {
    data?: T
    message?: string
}

export type QueryParamValue = string | number | boolean | null | undefined

export type QueryParams = Record<string, QueryParamValue>

export type ApiRequestConfig = {
    params?: QueryParams
}










