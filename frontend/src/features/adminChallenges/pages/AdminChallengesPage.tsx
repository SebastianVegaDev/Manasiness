import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../../shared/ui/Badge/Badge";
import { Button } from "../../../shared/ui/Button/Button";
import { Card } from "../../../shared/ui/Card/Card";
import { EmptyState } from "../../../shared/ui/EmptyState/EmptyState";
import { ErrorState } from "../../../shared/ui/ErrorState/ErrorState";
import { LoadingState } from "../../../shared/ui/LoadingState/LoadingState";
import { toChallengePayload } from "../helpers/adminChallengePayload.helpers";
import { adminChallengeService } from "../services/adminChallengeService";
import type { AdminChallenge } from "../types/adminChallenge.types";
import "./AdminChallengesPage.css";

export function AdminChallengesPage() {
	const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let isActive = true;

		async function loadChallenges() {
			try {
				const data = await adminChallengeService.getChallenges();

				if (isActive) {
					setChallenges(data);
				}
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Could not load challenges";

				if (isActive) {
					setError(message);
				}
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		}

		void loadChallenges();

		return () => {
			isActive = false;
		};
	}, []);

	async function handleTogglePublish(challenge: AdminChallenge) {
		setError("");

		try {
			const updatedChallenge = await adminChallengeService.updateChallenge(
				challenge.id,
				{
					...toChallengePayload(challenge),
					is_published: !challenge.is_published,
				}
			);

			setChallenges((currentChallenges) =>
				currentChallenges.map((currentChallenge) =>
					currentChallenge.id === updatedChallenge.id
						? updatedChallenge
						: currentChallenge
				)
			);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Could not update challenge";
			setError(message);
		}
	}

	async function handleDelete(challengeId: string) {
		const shouldDelete = window.confirm("Delete this challenge?");

		if (!shouldDelete) {
			return;
		}

		setError("");

		try {
			await adminChallengeService.deleteChallenge(challengeId);

			setChallenges((currentChallenges) =>
				currentChallenges.filter((challenge) => challenge.id !== challengeId)
			);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Could not delete challenge";
			setError(message);
		}
	}

	return (
		<div className="admin-challenges-page">
			<div className="admin-page-header">
				<div>
					<h1>Admin challenges</h1>
					<p className="admin-muted">Create, edit and publish challenges.</p>
				</div>

				<Link className="admin-link" to="/admin/challenges/new">
					New challenge
				</Link>
			</div>

			{error && <ErrorState message={error} />}
			{isLoading && <LoadingState message="Loading admin challenges..." />}

			{!isLoading && challenges.length === 0 && (
				<Card>
					<EmptyState
						title="No challenges yet"
						description="Create your first challenge from the admin panel."
						action={
							<Link className="admin-link" to="/admin/challenges/new">
								Create challenge
							</Link>
						}
					/>
				</Card>
			)}

			{!isLoading && challenges.length > 0 && (
				<div className="admin-list">
					{challenges.map((challenge) => (
						<Card key={challenge.id} className="admin-challenge-item">
							<div className="admin-item-header">
								<div>
									<h2>{challenge.title}</h2>
									<p className="admin-muted">/{challenge.slug}</p>
								</div>

								<Badge>{challenge.is_published ? "published" : "draft"}</Badge>
							</div>

							<p>{challenge.description}</p>

							<div className="admin-meta-list">
								<Badge>{challenge.difficulty}</Badge>
								<Badge>{challenge.topic}</Badge>
								<Badge>{challenge.language}</Badge>
								<Badge>fn: {challenge.function_name}</Badge>
							</div>

							<div className="admin-row-actions">
								<Link
									className="admin-link"
									to={`/admin/challenges/${challenge.id}/edit`}
								>
									Edit
								</Link>

								<Link
									className="admin-link"
									to={`/admin/challenges/${challenge.id}/test-cases`}
								>
									Test cases
								</Link>

								<Button
									variant="secondary"
									onClick={() => void handleTogglePublish(challenge)}
								>
									{challenge.is_published ? "Unpublish" : "Publish"}
								</Button>

								<Button
									variant="danger"
									onClick={() => void handleDelete(challenge.id)}
								>
									Delete
								</Button>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
