export const testCaseComparators = [
    "exact",
    "array_exact",
    "array_unordered",
    "number_tolerance",
] as const;

export type TestCaseComparator = (typeof testCaseComparators)[number];

export type TestCaseInput = {
    input_json: unknown;
    expected_output_json: unknown;
    is_hidden: boolean;
    comparator: TestCaseComparator;
};