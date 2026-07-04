import { pool } from "../../config/db.js";
import type { AuthenticatedUser } from "../../types/auth.types.js";
import type { ChallengeLanguage } from "../../types/challenge.types.js";
import type { JudgeTestCase } from "../../types/judge.types.js";
import type { Submission, SubmissionStatus } from "../../types/submission.types.js";

type PublishedChallengeForSubmission = {
    id: string;
    language: ChallengeLanguage;
	function_name: string;
};

type InsertSubmissionInput = {
    userId: string;
    challengeId: string;
    language: ChallengeLanguage;
    code: string;
    totalTests: number;
}

type UpsertUserProgressInput = {
    userId: string;
    challengeId: string;
    submissionId: string;
    status: SubmissionStatus;
    score: number;
}

type UpdateSubmissionResultInput = {
	submissionId: string;
	status: SubmissionStatus;
	passedTests: number;
	totalTests: number;
	score: number;
	runtimeMs: number;
	errorMessage: string | null;
};

const submissionSelect = `
    SELECT
        id,
        user_id,
        challenge_id,
        language,
        source_code AS code,
        status,
        passed_tests,
        total_tests,
        score,
        runtime_ms,
        error_message,
        created_at
    FROM submissions
`;

export async function findPublishedChallengeForSubmission(challengeId: string): Promise<PublishedChallengeForSubmission | null> {
    const { rows } = await pool.query(`
		SELECT id, language, function_name
		FROM challenges
		WHERE id = $1 AND is_published = true;
    `, [challengeId]);

    return rows[0] ?? null;
}

export async function countChallengeTestCases(challengeId: string) {
    const { rows } = await pool.query<{ total: string }>(`
        SELECT COUNT(*) AS total
        FROM test_cases
        WHERE challenge_id = $1;
    `, [challengeId]);

    return Number(rows[0]?.total ?? 0);
}

export async function insertSubmission(input: InsertSubmissionInput) {
    const { rows } = await pool.query<Submission>(`
        INSERT INTO submissions (
            user_id,
            challenge_id,
            language,
            source_code,
            status,
            passed_tests,
            total_tests,
            score,
            runtime_ms,
            error_message
        )
        VALUES ($1, $2, $3, $4, 'pending', 0, $5, 0, NULL, NULL)
        RETURNING
            id,
            user_id,
            challenge_id,
            language,
            source_code AS code,
            status,
            passed_tests,
            total_tests,
            score,
            runtime_ms,
            error_message,
            created_at;
    `, [
        input.userId,
        input.challengeId,
        input.language,
        input.code,
        input.totalTests,
    ]);

    return rows[0];
}

export async function findMySubmissionsByChallenge(challengeId: string, userId: string) {
    const { rows } = await pool.query(`
        ${submissionSelect}
        WHERE challenge_id = $1 AND user_id = $2
        ORDER BY created_at DESC;
    `, [challengeId, userId]);

    return rows;
}

export async function findSubmissionByIdForUser(submissionId: string, user: AuthenticatedUser) {
    const values = [submissionId];
    let ownerCondition = "";

    if (user.role !== "admin") {
        values.push(user.id);
        ownerCondition = `AND user_id = $${values.length}`;
    }

    const { rows } = await pool.query(`
        ${submissionSelect}
        WHERE id = $1 ${ownerCondition};
    `, values);

    return rows[0] ?? null;
}

export async function upsertUserProgressFromSubmission(input: UpsertUserProgressInput) {
    await pool.query(`
        INSERT INTO user_progress (
            user_id,
            challenge_id,
            solved,
            best_score,
            attempts_count,
            last_submission_id,
            last_attempt_at,
            updated_at
        )
        VALUES (
            $1,
            $2,
            $3 = 'accepted',
            $4,
            1,
            $5,
            NOW(),
            NOW()
        )
        ON CONFLICT (user_id, challenge_id)
        DO UPDATE SET
            solved = user_progress.solved OR EXCLUDED.solved,
            best_score = GREATEST(user_progress.best_score, EXCLUDED.best_score),
            attempts_count = user_progress.attempts_count + 1,
            last_submission_id = EXCLUDED.last_submission_id,
            last_attempt_at = EXCLUDED.last_attempt_at,
            updated_at = NOW();
    `, [
        input.userId,
        input.challengeId,
        input.status,
        input.score,
        input.submissionId,
    ])
}

export async function findTestCasesForJudge(challengeId: string) {
	const { rows } = await pool.query<JudgeTestCase>(`
		SELECT
			id,
			input_json,
			expected_output_json,
			is_hidden,
			comparator
		FROM test_cases
		WHERE challenge_id = $1
		ORDER BY sort_order ASC, created_at ASC;
	`, [challengeId]);

	return rows;
}

export async function updateSubmissionResult(input: UpdateSubmissionResultInput) {
	const { rows } = await pool.query<Submission>(`
		UPDATE submissions
		SET
			status = $1,
			passed_tests = $2,
			total_tests = $3,
			score = $4,
			runtime_ms = $5,
			error_message = $6
		WHERE id = $7
		RETURNING
			id,
			user_id,
			challenge_id,
			language,
			source_code AS code,
			status,
			passed_tests,
			total_tests,
			score,
			runtime_ms,
			error_message,
			created_at;
	`, [
		input.status,
		input.passedTests,
		input.totalTests,
		input.score,
		input.runtimeMs,
		input.errorMessage,
		input.submissionId,
	]);

	return rows[0];
}