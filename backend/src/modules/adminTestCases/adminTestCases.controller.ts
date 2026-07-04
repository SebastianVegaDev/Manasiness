import type { RequestHandler } from "express";
import { sendErrorResponse } from "../../errors/httpErrors.js";
import {
	createAdminTestCase,
	deleteAdminTestCase,
	listAdminTestCases,
	updateAdminTestCase,
} from "./adminTestCases.service.js";

function readParam(value: string | string[] | undefined, label: string) {
	if (Array.isArray(value) || !value?.trim()) {
		throw new Error(`${label} id is required`);
	}

	return value;
}

export const listTestCasesController: RequestHandler = async (req, res) => {
	try {
		const challengeId = readParam(req.params.challengeId, "Challenge");
		const testCases = await listAdminTestCases(challengeId);

		res.json({
			testCases,
		});
	} catch (error) {
		sendErrorResponse(res, error);
	}
};

export const createTestCaseController: RequestHandler = async (req, res) => {
	try {
		const challengeId = readParam(req.params.challengeId, "Challenge");
		const testCase = await createAdminTestCase(challengeId, req.body);

		res.status(201).json({
			testCase,
		});
	} catch (error) {
		sendErrorResponse(res, error);
	}
};

export const updateTestCaseController: RequestHandler = async (req, res) => {
	try {
		const testCaseId = readParam(req.params.testCaseId, "Test case");
		const testCase = await updateAdminTestCase(testCaseId, req.body);

		res.json({
			testCase,
		});
	} catch (error) {
		sendErrorResponse(res, error);
	}
};

export const deleteTestCaseController: RequestHandler = async (req, res) => {
	try {
		const testCaseId = readParam(req.params.testCaseId, "Test case");
		const testCase = await deleteAdminTestCase(testCaseId);

		res.json({
			message: "Test case deleted successfully",
			testCase,
		});
	} catch (error) {
		sendErrorResponse(res, error);
	}
};