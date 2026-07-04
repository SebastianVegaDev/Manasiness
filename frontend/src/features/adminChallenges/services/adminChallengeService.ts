import {
	apiDelete,
	apiGet,
	apiPost,
	apiPut,
} from "../../../shared/api/apiClient";
import type {
	AdminChallenge,
	AdminTestCase,
	ChallengePayload,
	TestCasePayload,
} from "../types/adminChallenge.types";

type ChallengesResponse = {
	challenges: AdminChallenge[];
};

type ChallengeResponse = {
	challenge: AdminChallenge;
};

type TestCasesResponse = {
	testCases: AdminTestCase[];
};

type TestCaseResponse = {
	testCase: AdminTestCase;
};

type DeleteChallengeResponse = {
	message: string;
	challenge: Pick<AdminChallenge, "id" | "title" | "slug">;
};

type DeleteTestCaseResponse = {
	message: string;
	testCase: Pick<AdminTestCase, "id" | "challenge_id">;
};

export const adminChallengeService = {
	async getChallenges() {
		const data = await apiGet<ChallengesResponse>("/admin/challenges");
		return data.challenges;
	},

	async getChallenge(id: string) {
		const data = await apiGet<ChallengeResponse>(`/admin/challenges/${id}`);
		return data.challenge;
	},

	async createChallenge(payload: ChallengePayload) {
		const data = await apiPost<ChallengeResponse, ChallengePayload>(
			"/admin/challenges",
			payload
		);

		return data.challenge;
	},

	async updateChallenge(id: string, payload: ChallengePayload) {
		const data = await apiPut<ChallengeResponse, ChallengePayload>(
			`/admin/challenges/${id}`,
			payload
		);

		return data.challenge;
	},

	async deleteChallenge(id: string) {
		return apiDelete<DeleteChallengeResponse>(`/admin/challenges/${id}`);
	},

	async getTestCases(challengeId: string) {
		const data = await apiGet<TestCasesResponse>(
			`/admin/challenges/${challengeId}/test-cases`
		);

		return data.testCases;
	},

	async createTestCase(challengeId: string, payload: TestCasePayload) {
		const data = await apiPost<TestCaseResponse, TestCasePayload>(
			`/admin/challenges/${challengeId}/test-cases`,
			payload
		);

		return data.testCase;
	},

	async updateTestCase(testCaseId: string, payload: TestCasePayload) {
		const data = await apiPut<TestCaseResponse, TestCasePayload>(
			`/admin/test-cases/${testCaseId}`,
			payload
		);

		return data.testCase;
	},

	async deleteTestCase(testCaseId: string) {
		return apiDelete<DeleteTestCaseResponse>(
			`/admin/test-cases/${testCaseId}`
		);
	},
};