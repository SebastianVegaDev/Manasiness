import type { TestCaseFormState } from "../types/adminTestCaseForm.types";

export const emptyTestCaseForm: TestCaseFormState = {
	inputJsonText: "[1, 2]",
	expectedOutputJsonText: "3",
	is_hidden: false,
	comparator: "exact",
};
