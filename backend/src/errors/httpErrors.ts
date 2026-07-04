import type { Response } from "express";

export function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Internal server error";
}

export function getErrorStatus(message: string) {
    const normalizedMessage = message.toLowerCase();

    if (normalizedMessage.includes("not found")) {
        return 404;
    }

    if (normalizedMessage.includes("already exists")) {
        return 409;
    }

    if (
        normalizedMessage.includes("unauthorized") ||
        normalizedMessage.includes("authentication")
    ) {
        return 401;
    }

    if (
        normalizedMessage.includes("forbidden") ||
        normalizedMessage.includes("admin only") ||
        normalizedMessage.includes("not allowed")
    ) {
        return 403;
    }

    if (
        normalizedMessage.includes("required") ||
        normalizedMessage.includes("must") ||
        normalizedMessage.includes("invalid") ||
        normalizedMessage.includes("use lowercase") ||
        normalizedMessage.includes("valid uuid")
    ) {
        return 400;
    }

    return 500;
}

export function sendErrorResponse(res: Response, error: unknown) {
    const message = getErrorMessage(error);

    res.status(getErrorStatus(message)).json({
        message,
    });
}