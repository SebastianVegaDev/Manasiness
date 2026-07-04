import type { TestCasePayload } from "../types/adminChallenge.types";
import type { TestCaseFormState } from "../types/adminTestCaseForm.types";

export function formatJson(value: unknown) {
	return JSON.stringify(value, null, 2);
}

export function toTestCaseFormState(testCase: TestCasePayload): TestCaseFormState {
	return {
		inputJsonText: formatJson(testCase.input_json),
		expectedOutputJsonText: formatJson(testCase.expected_output_json),
		is_hidden: testCase.is_hidden,
		comparator: testCase.comparator,
	};
}

export function buildTestCasePayload(
	form: TestCaseFormState
): TestCasePayload {
	return {
		input_json: parseJsonField(form.inputJsonText, "Input JSON"),
		expected_output_json: parseJsonField(
			form.expectedOutputJsonText,
			"Expected output JSON"
		),
		is_hidden: form.is_hidden,
		comparator: form.comparator,
	};
}

function parseJsonField(value: string, fieldName: string) {
	try {
		return JSON.parse(value) as unknown;
	} catch {
		throw new Error(`${fieldName} must be valid JSON`);
	}
}
