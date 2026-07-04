import type { TestCaseComparator } from "./adminChallenge.types";

export type TestCaseFormState = {
	inputJsonText: string;
	expectedOutputJsonText: string;
	is_hidden: boolean;
	comparator: TestCaseComparator;
};
