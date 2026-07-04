import { pool } from "../../config/db.js";
import type { ChallengeFilters } from "../../types/challenge.types.js";

export async function findPublishedChallenges(filters: ChallengeFilters) {
    const values: string[] = [];
    const conditions = ["is_published = true"];

    if (filters.search) {
        values.push(`%${filters.search}%`);
        conditions.push(
            `(title ILIKE $${values.length} OR description ILIKE $${values.length} OR topic ILIKE $${values.length})`
        );
    }

    if (filters.difficulty) {
        values.push(filters.difficulty);
        conditions.push(`difficulty = $${values.length}`);
    }

    if (filters.topic) {
        values.push(filters.topic);
        conditions.push(`topic = $${values.length}`);
    }

    if (filters.language) {
        values.push(filters.language);
        conditions.push(`language = $${values.length}`);
    }

    const { rows } = await pool.query(
        `
        SELECT
            id,
            title,
            slug,
            description,
            difficulty,
            topic,
            language,
            function_name,
            is_published,
            created_at,
            updated_at
        FROM challenges
        WHERE ${conditions.join(" AND ")}
        ORDER BY created_at DESC;
        `,
        values
    );

    return rows;
}

export async function findPublishedChallengeBySlug(slug: string) {
    const { rows } = await pool.query(
        `
        SELECT
            id,
            title,
            slug,
            description,
            difficulty,
            topic,
            language,
            starter_code,
            function_name,
            is_published,
            created_at,
            updated_at
        FROM challenges
        WHERE slug = $1 AND is_published = true;
        `,
        [slug]
    );

    return rows[0];
}