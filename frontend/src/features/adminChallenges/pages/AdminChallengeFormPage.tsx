import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../shared/ui/Button/Button";
import { Card } from "../../../shared/ui/Card/Card";
import { ErrorState } from "../../../shared/ui/ErrorState/ErrorState";
import { LoadingState } from "../../../shared/ui/LoadingState/LoadingState";
import { emptyChallengeForm } from "../constants/adminChallengeForm.constants";
import {
	buildChallengePayload,
	createSlug,
	toChallengeFormState,
} from "../helpers/adminChallengeForm.helpers";
import { adminChallengeService } from "../services/adminChallengeService";
import type { ChallengeFormState } from "../types/adminChallengeForm.types";
import "./AdminChallengeFormPage.css";

export function AdminChallengeFormPage() {
	const navigate = useNavigate();
	const { id } = useParams();
	const isEditing = Boolean(id);

	const [form, setForm] = useState<ChallengeFormState>(emptyChallengeForm);
	const [isLoading, setIsLoading] = useState(isEditing);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!id) {
			return;
		}

		const challengeId = id;

		async function loadChallenge() {
			setIsLoading(true);
			setError("");

			try {
				const challenge = await adminChallengeService.getChallenge(challengeId);

				setForm(toChallengeFormState(challenge));
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Could not load challenge";
				setError(message);
			} finally {
				setIsLoading(false);
			}
		}

		void loadChallenge();
	}, [id]);

	function handleTextChange(
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) {
		const { name, value } = event.target;

		setForm((currentForm) => ({
			...currentForm,
			[name]: value,
		}));
	}

	function handlePublishedChange(event: ChangeEvent<HTMLInputElement>) {
		setForm((currentForm) => ({
			...currentForm,
			is_published: event.target.checked,
		}));
	}

	function handleGenerateSlug() {
		setForm((currentForm) => ({
			...currentForm,
			slug: createSlug(currentForm.title),
		}));
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		setIsSaving(true);

		try {
			const payload = buildChallengePayload(form);

			if (id) {
				await adminChallengeService.updateChallenge(id, payload);
			} else {
				await adminChallengeService.createChallenge(payload);
			}

			navigate("/admin/challenges");
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Could not save challenge";
			setError(message);
		} finally {
			setIsSaving(false);
		}
	}

	if (isLoading) {
		return <LoadingState message="Loading challenge..." />;
	}

	return (
		<div className="admin-challenge-form-page">
			<div className="admin-page-header">
				<div>
					<h1>{isEditing ? "Edit challenge" : "New challenge"}</h1>
					<p className="admin-muted">Basic form first. Better design later.</p>
				</div>

				<Link className="admin-link" to="/admin/challenges">
					Back
				</Link>
			</div>

			{error && <ErrorState message={error} />}

			<Card>
				<form className="admin-form" onSubmit={handleSubmit}>
					<div className="admin-form-row">
						<label>
							Title
							<input
								name="title"
								value={form.title}
								onChange={handleTextChange}
								placeholder="Sum two numbers"
							/>
						</label>

						<label>
							Slug
							<input
								name="slug"
								value={form.slug}
								onChange={handleTextChange}
								placeholder="sum-two-numbers"
							/>
						</label>
					</div>

					<div className="admin-page-actions">
						<Button variant="secondary" onClick={handleGenerateSlug}>
							Generate slug
						</Button>
					</div>

					<label>
						Description
						<textarea
							name="description"
							value={form.description}
							onChange={handleTextChange}
							placeholder="Explain what the user needs to solve."
						/>
					</label>

					<div className="admin-form-row">
						<label>
							Difficulty
							<select
								name="difficulty"
								value={form.difficulty}
								onChange={handleTextChange}
							>
								<option value="easy">easy</option>
								<option value="medium">medium</option>
								<option value="hard">hard</option>
							</select>
						</label>

						<label>
							Topic
							<input
								name="topic"
								value={form.topic}
								onChange={handleTextChange}
								placeholder="arrays"
							/>
						</label>
					</div>

					<div className="admin-form-row">
						<label>
							Language
							<select
								name="language"
								value={form.language}
								onChange={handleTextChange}
							>
								<option value="javascript">javascript</option>
								<option value="typescript">typescript</option>
								<option value="sql">sql</option>
							</select>
						</label>

						<label>
							Function name
							<input
								name="function_name"
								value={form.function_name}
								onChange={handleTextChange}
								placeholder="solve"
							/>
						</label>
					</div>

					<label>
						Starter code
						<textarea
							name="starter_code"
							value={form.starter_code}
							onChange={handleTextChange}
						/>
					</label>

					<label className="admin-checkbox-label">
						<input
							type="checkbox"
							checked={form.is_published}
							onChange={handlePublishedChange}
						/>
						Published
					</label>

					<div className="admin-form-actions">
						<Button type="submit" disabled={isSaving}>
							{isSaving ? "Saving..." : "Save challenge"}
						</Button>

						{id && (
							<Link className="admin-link" to={`/admin/challenges/${id}/test-cases`}>
								Manage test cases
							</Link>
						)}
					</div>
				</form>
			</Card>
		</div>
	);
}
