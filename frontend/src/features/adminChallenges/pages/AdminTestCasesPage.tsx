import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../../../shared/ui/Badge/Badge";
import { Button } from "../../../shared/ui/Button/Button";
import { Card } from "../../../shared/ui/Card/Card";
import { EmptyState } from "../../../shared/ui/EmptyState/EmptyState";
import { ErrorState } from "../../../shared/ui/ErrorState/ErrorState";
import { LoadingState } from "../../../shared/ui/LoadingState/LoadingState";
import { emptyTestCaseForm } from "../constants/adminTestCaseForm.constants";
import {
	buildTestCasePayload,
	formatJson,
	toTestCaseFormState,
} from "../helpers/adminTestCaseForm.helpers";
import { adminChallengeService } from "../services/adminChallengeService";
import type { AdminChallenge, AdminTestCase } from "../types/adminChallenge.types";
import type { TestCaseFormState } from "../types/adminTestCaseForm.types";
import "./AdminTestCasesPage.css";

export function AdminTestCasesPage() {
	const { id } = useParams();
	const missingChallengeIdMessage = id ? "" : "Challenge id is required";

	const [challenge, setChallenge] = useState<AdminChallenge | null>(null);
	const [testCases, setTestCases] = useState<AdminTestCase[]>([]);
	const [form, setForm] = useState<TestCaseFormState>(emptyTestCaseForm);
	const [editingTestCaseId, setEditingTestCaseId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(Boolean(id));
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!id) {
			return;
		}

		const challengeId = id;

		async function loadPageData() {
			setIsLoading(true);
			setError("");

			try {
				const [challengeData, testCasesData] = await Promise.all([
					adminChallengeService.getChallenge(challengeId),
					adminChallengeService.getTestCases(challengeId),
				]);

				setChallenge(challengeData);
				setTestCases(testCasesData);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Could not load test cases";
				setError(message);
			} finally {
				setIsLoading(false);
			}
		}

		void loadPageData();
	}, [id]);

	function handleTextChange(
		event: ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
	) {
		const { name, value } = event.target;

		setForm((currentForm) => ({
			...currentForm,
			[name]: value,
		}));
	}

	function handleHiddenChange(event: ChangeEvent<HTMLInputElement>) {
		setForm((currentForm) => ({
			...currentForm,
			is_hidden: event.target.checked,
		}));
	}

	function handleEdit(testCase: AdminTestCase) {
		setEditingTestCaseId(testCase.id);

		setForm(toTestCaseFormState(testCase));
	}

	function resetForm() {
		setEditingTestCaseId(null);
		setForm(emptyTestCaseForm);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!id) {
			setError("Challenge id is required");
			return;
		}

		setError("");
		setIsSaving(true);

		try {
			const payload = buildTestCasePayload(form);

			if (editingTestCaseId) {
				const updatedTestCase = await adminChallengeService.updateTestCase(
					editingTestCaseId,
					payload
				);

				setTestCases((currentTestCases) =>
					currentTestCases.map((testCase) =>
						testCase.id === updatedTestCase.id ? updatedTestCase : testCase
					)
				);
			} else {
				const newTestCase = await adminChallengeService.createTestCase(
					id,
					payload
				);

				setTestCases((currentTestCases) => [...currentTestCases, newTestCase]);
			}

			resetForm();
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Could not save test case";
			setError(message);
		} finally {
			setIsSaving(false);
		}
	}

	async function handleDelete(testCaseId: string) {
		const shouldDelete = window.confirm("Delete this test case?");

		if (!shouldDelete) {
			return;
		}

		setError("");

		try {
			await adminChallengeService.deleteTestCase(testCaseId);

			setTestCases((currentTestCases) =>
				currentTestCases.filter((testCase) => testCase.id !== testCaseId)
			);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Could not delete test case";
			setError(message);
		}
	}

	if (isLoading) {
		return <LoadingState message="Loading test cases..." />;
	}

	return (
		<div className="admin-test-cases-page">
			<div className="admin-page-header">
				<div>
					<h1>Test cases</h1>
					<p className="admin-muted">
						Challenge: <strong>{challenge?.title}</strong>
					</p>
				</div>

				<Link className="admin-link" to="/admin/challenges">
					Back
				</Link>
			</div>

			{(missingChallengeIdMessage || error) && (
				<ErrorState message={missingChallengeIdMessage || error} />
			)}

			<Card>
				<h2>{editingTestCaseId ? "Edit test case" : "New test case"}</h2>

				<form className="admin-form" onSubmit={handleSubmit}>
					<label>
						Input JSON
						<textarea
							name="inputJsonText"
							value={form.inputJsonText}
							onChange={handleTextChange}
						/>
					</label>

					<label>
						Expected output JSON
						<textarea
							name="expectedOutputJsonText"
							value={form.expectedOutputJsonText}
							onChange={handleTextChange}
						/>
					</label>

					<div className="admin-form-row">
						<label>
							Comparator
							<select
								name="comparator"
								value={form.comparator}
								onChange={handleTextChange}
							>
								<option value="exact">exact</option>
								<option value="array_exact">array_exact</option>
								<option value="array_unordered">array_unordered</option>
								<option value="number_tolerance">number_tolerance</option>
							</select>
						</label>

						<label className="admin-checkbox-label">
							<input
								type="checkbox"
								checked={form.is_hidden}
								onChange={handleHiddenChange}
							/>
							Hidden test
						</label>
					</div>

					<div className="admin-form-actions">
						<Button type="submit" disabled={isSaving}>
							{isSaving ? "Saving..." : "Save test case"}
						</Button>

						{editingTestCaseId && (
							<Button variant="secondary" onClick={resetForm}>
								Cancel edit
							</Button>
						)}
					</div>
				</form>
			</Card>

			<Card>
				<h2>Saved test cases</h2>

				{testCases.length === 0 && (
					<EmptyState
						title="No test cases yet"
						description="Create one visible test and one hidden test."
					/>
				)}

				{testCases.length > 0 && (
					<div className="admin-list">
						{testCases.map((testCase) => (
							<article key={testCase.id} className="admin-test-case-item">
								<div className="admin-item-header">
									<div className="admin-meta-list">
										<Badge>{testCase.is_hidden ? "hidden" : "visible"}</Badge>
										<Badge>{testCase.comparator}</Badge>
									</div>

									<div className="admin-row-actions">
										<Button
											variant="secondary"
											onClick={() => handleEdit(testCase)}
										>
											Edit
										</Button>

										<Button
											variant="danger"
											onClick={() => void handleDelete(testCase.id)}
										>
											Delete
										</Button>
									</div>
								</div>

								<p>Input</p>
								<pre className="admin-json-box">
									{formatJson(testCase.input_json)}
								</pre>

								<p>Expected output</p>
								<pre className="admin-json-box">
									{formatJson(testCase.expected_output_json)}
								</pre>
							</article>
						))}
					</div>
				)}
			</Card>
		</div>
	);
}
