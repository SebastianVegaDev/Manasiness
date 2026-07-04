import type { CreateSubmissionInput } from "../types/submission.types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export function validateSubmissionInput(payload: unknown): CreateSubmissionInput {
    if (!isRecord(payload)) {
        throw new Error("Submission body is required");
    }

    const code = payload.code;

    if (typeof code !== "string" || !code.trim()) {
        throw new Error("Code is required");
    }

    if (code.length > 20000) {
        throw new Error("Code must have 20000 characters or less");
    }

    return {
        code,
    };
}
