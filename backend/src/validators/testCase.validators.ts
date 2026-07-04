import {
    testCaseComparators,
    type TestCaseComparator,
    type TestCaseInput,
} from "../types/testCase.types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function readBoolean(
    input: Record<string, unknown>,
    key: string,
    defaultValue: boolean
) {
    const value = input[key];

    if (value === undefined) {
        return defaultValue;
    }

    if (typeof value !== "boolean") {
        throw new Error(`${key} must be true or false`);
    }

    return value;
}

function readString(
    input: Record<string, unknown>,
    key: string,
    defaultValue: string
) {
    const value = input[key];

    if (value === undefined) {
        return defaultValue;
    }

    if (typeof value !== "string") {
        throw new Error(`${key} must be text`);
    }

    return value.trim();
}

function isComparator(value: string): value is TestCaseComparator {
    return (testCaseComparators as readonly string[]).includes(value);
}

function assertJsonFieldExists(input: Record<string, unknown>, key: string) {
    if (!(key in input)) {
        throw new Error(`${key} is required`);
    }

    return input[key];
}

export function validateTestCaseInput(payload: unknown): TestCaseInput {
    if (!isRecord(payload)) {
        throw new Error("Test case body is required");
    }

    const input_json = assertJsonFieldExists(payload, "input_json");
    const expected_output_json = assertJsonFieldExists(
        payload,
        "expected_output_json"
    );
    const is_hidden = readBoolean(payload, "is_hidden", true);
    const comparator = readString(payload, "comparator", "exact");

    if (!isComparator(comparator)) {
        throw new Error(
            "Comparator must be exact, array_exact, array_unordered or number_tolerance"
        );
    }

    return {
        input_json,
        expected_output_json,
        is_hidden,
        comparator,
    };
}