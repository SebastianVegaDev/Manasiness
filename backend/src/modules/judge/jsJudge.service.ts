import { performance } from "node:perf_hooks";
import { Script } from "node:vm";
import type {
	JudgeResult,
	JudgeTestCase,
	JudgeTestResult,
} from "../../types/judge.types.js";

type RunJavaScriptJudgeInput = {
	code: string;
	functionName: string;
	testCases: JudgeTestCase[];
};

type JudgeSandbox = {
	module: {
		exports: unknown;
	};
	exports: unknown;
	__args: unknown[];
	__result?: unknown;
	[key: string]: unknown;
};

function normalizeArgs(input: unknown): unknown[] {
	if (Array.isArray(input)) {
		return input;
	}

	return [input];
}

function compareExact(received: unknown, expected: unknown) {
	return JSON.stringify(received) === JSON.stringify(expected);
}

function getErrorMessage(error: unknown) {
	if (error instanceof Error) {
		return error.message;
	}

	return "Unknown judge error";
}

function runSingleTest(
	code: string,
	functionName: string,
	testCase: JudgeTestCase
) {
	const sandbox: JudgeSandbox = {
		module: {
			exports: {},
		},
		exports: {},
		__args: normalizeArgs(testCase.input_json),
	};

	const script = new Script(`
		${code}

		;(() => {
			const functionName = ${JSON.stringify(functionName)};
			const exportedValue = module.exports;

			const candidate =
				typeof exportedValue === "function"
					? exportedValue
					: globalThis[functionName];

			if (typeof candidate !== "function") {
				throw new Error(\`Function "\${functionName}" was not found\`);
			}

			__result = candidate(...__args);
		})();
	`);

	script.runInNewContext(sandbox, {
		timeout: 1000,
	});

	return sandbox.__result;
}

export function runJavaScriptJudge({
	code,
	functionName,
	testCases,
}: RunJavaScriptJudgeInput): JudgeResult {
	const startTime = performance.now();
	const results: JudgeTestResult[] = [];

	let passedTests = 0;
	let errorMessage: string | null = null;
	let hasRuntimeError = false;

	for (const testCase of testCases) {
		try {
			const received = runSingleTest(code, functionName, testCase);
			const passed = compareExact(
				received,
				testCase.expected_output_json
			);

			if (passed) {
				passedTests += 1;
			}

			results.push({
				test_case_id: testCase.id,
				passed,
				input: testCase.input_json,
				expected: testCase.expected_output_json,
				received,
				error_message: null,
			});
		} catch (error) {
			hasRuntimeError = true;
			errorMessage = getErrorMessage(error);

			results.push({
				test_case_id: testCase.id,
				passed: false,
				input: testCase.input_json,
				expected: testCase.expected_output_json,
				received: null,
				error_message: errorMessage,
			});

			break;
		}
	}

	const runtimeMs = Math.round(performance.now() - startTime);
	const totalTests = testCases.length;

	const status = hasRuntimeError
		? "runtime_error"
		: passedTests === totalTests
			? "accepted"
			: "wrong_answer";

	const score = totalTests === 0 ? 0 : Math.round((passedTests / totalTests) * 100);

	return {
		status,
		passed_tests: passedTests,
		total_tests: totalTests,
		score,
		runtime_ms: runtimeMs,
		error_message: errorMessage,
		results,
	};
}