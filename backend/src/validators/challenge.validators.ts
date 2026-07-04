import {
    challengeDifficulties,
    challengeLanguages,
    type ChallengeDifficulty,
    type ChallengeFilters,
    type ChallengeInput,
    type ChallengeLanguage,
} from "../types/challenge.types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function readString(input: Record<string, unknown>, key: string) {
    const value = input[key];

    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
}

function readBoolean(
    input: Record<string, unknown>,
    key: string,
    defaultValue: boolean
) {
    const value = input[key];

    if (value === undefined) {
        return defaultValue;
    }

    if (typeof value !== "boolean") {
        throw new Error(`${key} must be true or false`);
    }

    return value;
}

function isDifficulty(value: string): value is ChallengeDifficulty {
    return (challengeDifficulties as readonly string[]).includes(value);
}

function isLanguage(value: string): value is ChallengeLanguage {
    return (challengeLanguages as readonly string[]).includes(value);
}

export function validateChallengeInput(payload: unknown): ChallengeInput {
    if (!isRecord(payload)) {
        throw new Error("Challenge body is required");
    }

    const title = readString(payload, "title");
    const slug = readString(payload, "slug");
    const description = readString(payload, "description");
    const difficulty = readString(payload, "difficulty");
    const topic = readString(payload, "topic");
    const language = readString(payload, "language");
    const starter_code = readString(payload, "starter_code");
    const function_name = readString(payload, "function_name");
    const is_published = readBoolean(payload, "is_published", false);

    if (
        !title ||
        !slug ||
        !description ||
        !difficulty ||
        !topic ||
        !language ||
        !starter_code ||
        !function_name
    ) {
        throw new Error(
            "Title, slug, description, difficulty, topic, language, starter_code and function_name are required"
        );
    }

    if (title.length < 3) {
        throw new Error("Title must have at least 3 characters");
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw new Error("Slug must use lowercase letters, numbers and hyphens");
    }

    if (!isDifficulty(difficulty)) {
        throw new Error("Difficulty must be easy, medium or hard");
    }

    if (!isLanguage(language)) {
        throw new Error("Language must be javascript, typescript or sql");
    }

    if (topic.length < 2) {
        throw new Error("Topic must have at least 2 characters");
    }

    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(function_name)) {
        throw new Error("Function name must be a valid JavaScript function name");
    }

    return {
        title,
        slug,
        description,
        difficulty,
        topic,
        language,
        starter_code,
        function_name,
        is_published,
    };
}

export function validateChallengeFilters(
    query: Record<string, unknown>
): ChallengeFilters {
    const search = readString(query, "search");
    const difficulty = readString(query, "difficulty");
    const topic = readString(query, "topic");
    const language = readString(query, "language");

    const filters: ChallengeFilters = {};

    if (search) {
        filters.search = search;
    }

    if (difficulty) {
        if (!isDifficulty(difficulty)) {
            throw new Error("Difficulty must be easy, medium or hard");
        }

        filters.difficulty = difficulty;
    }

    if (topic) {
        filters.topic = topic;
    }

    if (language) {
        if (!isLanguage(language)) {
            throw new Error("Language must be javascript, typescript or sql");
        }

        filters.language = language;
    }

    return filters;
}

export function validateId(id: string, entityName: string) {
    if (!id.trim()) {
        throw new Error(`${entityName} id is required`);
    }

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
        throw new Error(`${entityName} id must be a valid UUID`);
    }
}