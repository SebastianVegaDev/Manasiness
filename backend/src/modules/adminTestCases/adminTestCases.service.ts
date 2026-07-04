import { validateTestCaseInput } from "../../validators/testCase.validators.js";
import {
    deleteTestCaseById,
    findChallengeById,
    findTestCasesByChallengeId,
    insertTestCase,
    updateTestCaseById,
} from "./adminTestCases.repository.js";
import { validateId } from "../../validators/challenge.validators.js";

export async function listAdminTestCases(challengeId: string) {
    validateId(challengeId, "Challenge");

    const challenge = await findChallengeById(challengeId);

    if (!challenge) {
        throw new Error("Challenge not found");
    }

    return findTestCasesByChallengeId(challengeId);
}

export async function createAdminTestCase(challengeId: string, input: unknown) {
    validateId(challengeId, "Challenge");

    const challenge = await findChallengeById(challengeId);

    if (!challenge) {
        throw new Error("Challenge not found");
    }

    const validatedInput = validateTestCaseInput(input);

    return insertTestCase(challengeId, validatedInput);
}

export async function updateAdminTestCase(id: string, input: unknown) {
    validateId(id, "Test case");

    const validatedInput = validateTestCaseInput(input);
    const testCase = await updateTestCaseById(id, validatedInput);

    if (!testCase) {
        throw new Error("Test case not found");
    }

    return testCase;
}

export async function deleteAdminTestCase(id: string) {
    validateId(id, "Test case");

    const testCase = await deleteTestCaseById(id);

    if (!testCase) {
        throw new Error("Test case not found");
    }

    return testCase;
}