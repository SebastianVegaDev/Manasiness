import type { ChallengeDifficulty, ChallengeInput } from "../types/admin.types.js";

const difficulties: ChallengeDifficulty[] = ["easy", "medium", "hard"];

export function validateChallengeInput(input: ChallengeInput) {
    if (
        !input.title?.trim() ||
        !input.slug?.trim() ||
        !input.description?.trim() ||
        !input.difficulty ||
        !input.starter_code?.trim()
    ) {
        throw new Error("Title, slug, description, difficulty and starter_code are required");
    }

    if (!difficulties.includes(input.difficulty)) {
        throw new Error("Difficulty must be easy, medium or hard");
    }

    if (input.title.trim().length < 3) {
        throw new Error("Title must have at least 3 characters");
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) {
        throw new Error("Slug must use lowercase letters, numbers and hyphens");
    }
}