import type { AuthenticatedUser } from "../../types/auth.types.js";
import { validateId } from "../../validators/challenge.validators.js";
import { validateSubmissionInput } from "../../validators/submission.validators.js";
import { 
    findMySubmissionsByChallenge,
    findPublishedChallengeForSubmission,
    findSubmissionByIdForUser,
    insertSubmission,
    upsertUserProgressFromSubmission,
    findTestCasesForJudge,
    updateSubmissionResult,
} from "./submissions.repository.js";
import { runJavaScriptJudge } from "../judge/jsJudge.service.js";

export async function createSubmission(challengeId: string, payload: unknown, user: AuthenticatedUser) {
    validateId(challengeId, "Challenge");

	const input = validateSubmissionInput(payload);
	const challenge = await findPublishedChallengeForSubmission(challengeId);

	if (!challenge) {
		throw new Error("Challenge not found");
	}

	if (challenge.language !== "javascript") {
		throw new Error("Only JavaScript judge is available for now");
	}

	const testCases = await findTestCasesForJudge(challenge.id);

	if (testCases.length === 0) {
		throw new Error("Challenge has no test cases");
	}

	const submission = await insertSubmission({
		userId: user.id,
		challengeId: challenge.id,
		language: challenge.language,
		code: input.code,
		totalTests: testCases.length,
	});

	const judgeResult = runJavaScriptJudge({
		code: input.code,
		functionName: challenge.function_name,
		testCases,
	});

	const finalSubmission = await updateSubmissionResult({
		submissionId: submission.id,
		status: judgeResult.status,
		passedTests: judgeResult.passed_tests,
		totalTests: judgeResult.total_tests,
		score: judgeResult.score,
		runtimeMs: judgeResult.runtime_ms,
		errorMessage: judgeResult.error_message,
	});

	await upsertUserProgressFromSubmission({
		userId: user.id,
		challengeId: challenge.id,
		submissionId: finalSubmission.id,
		status: finalSubmission.status,
		score: finalSubmission.score,
	});

	return finalSubmission;
}

export async function listMySubmissions(challengeId: string, userId: string) {
    validateId(challengeId, "Challenge");

    const challenge = await findPublishedChallengeForSubmission(challengeId);

    if (!challenge) {
        throw new Error("Challenge not found");
    }

    return findMySubmissionsByChallenge(challenge.id, userId);
}

export async function getSubmissionById(submissionId: string, user: AuthenticatedUser) {
    validateId(submissionId, "Submission");

    const submission = await findSubmissionByIdForUser(submissionId, user);

    if (!submission) {
        throw new Error("Submission not found");
    }

    return submission;
}
