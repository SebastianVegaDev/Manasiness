import { validateChallengeFilters } from "../../validators/challenge.validators.js";
import {
    findPublishedChallengeBySlug,
    findPublishedChallenges,
} from "./challenges.repository.js";

export async function getPublishedChallenges(query: Record<string, unknown>) {
    const filters = validateChallengeFilters(query);

    return findPublishedChallenges(filters);
}

export async function getPublishedChallengeBySlug(slug: string) {
    if (!slug.trim()) {
        throw new Error("Challenge slug is required");
    }

    const challenge = await findPublishedChallengeBySlug(slug);

    if (!challenge) {
        throw new Error("Challenge not found");
    }

    return challenge;
}