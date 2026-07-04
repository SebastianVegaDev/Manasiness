import type { SubmissionStatus } from "./submission.types.js";
import type { TestCaseComparator } from "./testCase.types.js";

export type JudgeTestCase = {
	id: string;
	input_json: unknown;
	expected_output_json: unknown;
	is_hidden: boolean;
	comparator: TestCaseComparator;
};

export type JudgeTestResult = {
	test_case_id: string;
	passed: boolean;
	input: unknown;
	expected: unknown;
	received: unknown;
	error_message: string | null;
};

export type JudgeResult = {
	status: SubmissionStatus;
	passed_tests: number;
	total_tests: number;
	score: number;
	runtime_ms: number;
	error_message: string | null;
	results: JudgeTestResult[];
};