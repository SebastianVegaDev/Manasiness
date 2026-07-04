import { AppError } from "./app-error.js"

export function badRequest(message = "Bad request") {
    return new AppError(message, 400)
}

export function unauthorized(message = "Unauthorized") {
    return new AppError(message, 401)
}

export function forbidden(message = "Forbidden") {
    return new AppError(message, 403)
}

export function notFound(message = "Not found") {
    return new AppError(message, 404)
}

export function conflict(message = "Conflict") {
    return new AppError(message, 409)
}