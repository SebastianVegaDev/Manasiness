import { pool } from "../../config/db.js";
import type { ChallengeInput } from "../../types/challenge.types.js";

type DatabaseError = {
	code?: string;
};

function isDatabaseError(error: unknown): error is DatabaseError {
	return typeof error === "object" && error !== null && "code" in error;
}

function handleChallengeDatabaseError(error: unknown): never {
	if (isDatabaseError(error) && error.code === "23505") {
		throw new Error("Challenge slug already exists");
	}

	throw error;
}

const challengeAdminSelect = `
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
	created_by,
	created_at,
	updated_at
`;

export async function findAdminChallenges() {
	const { rows } = await pool.query(
		`
		SELECT ${challengeAdminSelect}
		FROM challenges
		ORDER BY created_at DESC;
		`
	);

	return rows;
}

export async function findAdminChallengeById(id: string) {
	const { rows } = await pool.query(
		`
		SELECT ${challengeAdminSelect}
		FROM challenges
		WHERE id = $1;
		`,
		[id]
	);

	return rows[0];
}

export async function insertChallenge(input: ChallengeInput, createdBy: string) {
	try {
		const { rows } = await pool.query(
			`
			INSERT INTO challenges (
				title,
				slug,
				description,
				difficulty,
				topic,
				language,
				starter_code,
				function_name,
				is_published,
				created_by
			)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
			RETURNING ${challengeAdminSelect};
			`,
			[
				input.title,
				input.slug,
				input.description,
				input.difficulty,
				input.topic,
				input.language,
				input.starter_code,
				input.function_name,
				input.is_published,
				createdBy,
			]
		);

		return rows[0];
	} catch (error) {
		handleChallengeDatabaseError(error);
	}
}

export async function updateChallengeById(id: string, input: ChallengeInput) {
	try {
		const { rows } = await pool.query(
			`
			UPDATE challenges
			SET
				title = $1,
				slug = $2,
				description = $3,
				difficulty = $4,
				topic = $5,
				language = $6,
				starter_code = $7,
				function_name = $8,
				is_published = $9,
				updated_at = NOW()
			WHERE id = $10
			RETURNING ${challengeAdminSelect};
			`,
			[
				input.title,
				input.slug,
				input.description,
				input.difficulty,
				input.topic,
				input.language,
				input.starter_code,
				input.function_name,
				input.is_published,
				id,
			]
		);

		return rows[0];
	} catch (error) {
		handleChallengeDatabaseError(error);
	}
}

export async function deleteChallengeById(id: string) {
	const { rows } = await pool.query(
		`
		DELETE FROM challenges
		WHERE id = $1
		RETURNING id, title, slug;
		`,
		[id]
	);

	return rows[0];
}