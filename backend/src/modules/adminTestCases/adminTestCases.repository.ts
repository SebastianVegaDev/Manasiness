import { pool } from "../../config/db.js";
import type { TestCaseInput } from "../../types/testCase.types.js";

function toJsonb(value: unknown) {
    return JSON.stringify(value);
}

export async function findChallengeById(id: string) {
    const { rows } = await pool.query(
        `
        SELECT id, title, slug
        FROM challenges
        WHERE id = $1;
        `,
        [id]
    );

    return rows[0];
}

export async function findTestCasesByChallengeId(challengeId: string) {
    const { rows } = await pool.query(
        `
        SELECT
            id,
            challenge_id,
            input_json,
            expected_output_json,
            is_hidden,
            comparator,
            sort_order,
            created_at,
            updated_at
        FROM test_cases
        WHERE challenge_id = $1
        ORDER BY sort_order ASC, created_at ASC;
        `,
        [challengeId]
    );

    return rows;
}

export async function insertTestCase(
    challengeId: string,
    input: TestCaseInput
) {
    const { rows } = await pool.query(
        `
        INSERT INTO test_cases (
            challenge_id,
            input,
            expected_output,
            input_json,
            expected_output_json,
            is_hidden,
            comparator
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
            id,
            challenge_id,
            input_json,
            expected_output_json,
            is_hidden,
            comparator,
            sort_order,
            created_at,
            updated_at;
        `,
        [
            challengeId,
            toJsonb(input.input_json),
            toJsonb(input.expected_output_json),
            toJsonb(input.input_json),
            toJsonb(input.expected_output_json),
            input.is_hidden,
            input.comparator,
        ]
    );

    return rows[0];
}

export async function updateTestCaseById(
    id: string,
    input: TestCaseInput
) {
    const { rows } = await pool.query(
        `
        UPDATE test_cases
        SET
            input = $1,
            expected_output = $2,
            input_json = $3,
            expected_output_json = $4,
            is_hidden = $5,
            comparator = $6,
            updated_at = NOW()
        WHERE id = $7
        RETURNING
            id,
            challenge_id,
            input_json,
            expected_output_json,
            is_hidden,
            comparator,
            sort_order,
            created_at,
            updated_at;
        `,
        [
            toJsonb(input.input_json),
            toJsonb(input.expected_output_json),
            toJsonb(input.input_json),
            toJsonb(input.expected_output_json),
            input.is_hidden,
            input.comparator,
            id,
        ]
    );

    return rows[0];
}

export async function deleteTestCaseById(id: string) {
    const { rows } = await pool.query(
        `
        DELETE FROM test_cases
        WHERE id = $1
        RETURNING id, challenge_id;
        `,
        [id]
    );

    return rows[0];
}