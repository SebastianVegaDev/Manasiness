import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../../../shared/ui/Card/Card.tsx";
import { EmptyState } from "../../../shared/ui/EmptyState/EmptyState.tsx";
import { ErrorState } from "../../../shared/ui/ErrorState/ErrorState.tsx";
import { LoadingState } from "../../../shared/ui/LoadingState/LoadingState.tsx";
import { ChallengeAttemptHistory } from "../components/ChallengeDetail//ChallengeAttemptHistory.tsx";
import { ChallengeCodeWorkspace } from "../components/ChallengeDetail//ChallengeCodeWorkspace.tsx";
import { ChallengeDetailHeader } from "../components/ChallengeDetail/ChallengeDetailHeader.tsx";
import { ChallengeOverviewCard } from "../components/ChallengeDetail//ChallengeOverviewCard.tsx";
import { ChallengeResultPanel } from "../components/ChallengeDetail//ChallengeResultPanel.tsx";
import { challengeService } from "../services/challengeService.ts";
import type {
	ChallengeSubmission,
	PublicChallengeDetail,
} from "../types/challenge.types.ts";
import "./ChallengeDetailPage.css";

export function ChallengeDetailPage() {
	const { slug } = useParams();

	const [challenge, setChallenge] = useState<PublicChallengeDetail | null>(null);
	const [code, setCode] = useState("");
	const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
	const [currentResult, setCurrentResult] = useState<ChallengeSubmission | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [submissionError, setSubmissionError] = useState("");

	useEffect(() => {
		if (!slug) {
			setError("Challenge slug is required");
			setIsLoading(false);
			return;
		}

		const challengeSlug = slug;
		let isActive = true;

		async function loadChallenge() {
			setIsLoading(true);
			setError("");
			setSubmissionError("");

			try {
				const challengeData = await challengeService.getChallengeBySlug(challengeSlug);
				const submissionData = await challengeService.getMySubmissions(
					challengeData.id
				);

				if (isActive) {
					setChallenge(challengeData);
					setCode(challengeData.starter_code);
					setSubmissions(submissionData);
					setCurrentResult(submissionData[0] ?? null);
				}
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Could not load challenge";

				if (isActive) {
					setError(message);
				}
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		}

		void loadChallenge();

		return () => {
			isActive = false;
		};
	}, [slug]);

	function handleResetCode() {
		if (!challenge) {
			return;
		}

		setCode(challenge.starter_code);
	}

	async function handleRunTests() {
		if (!challenge || !code.trim() || isSubmitting) {
			return;
		}

		setIsSubmitting(true);
		setSubmissionError("");

		try {
			const submission = await challengeService.createSubmission(challenge.id, {
				code,
			});

			setCurrentResult(submission);
			setSubmissions((currentSubmissions) => [
				submission,
				...currentSubmissions,
			]);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Could not create submission";

			setSubmissionError(message);
		} finally {
			setIsSubmitting(false);
		}
	}

	if (isLoading) {
		return <LoadingState message="Loading challenge..." />;
	}

	if (error) {
		return <ErrorState message={error} />;
	}

	if (!challenge) {
		return (
			<Card>
				<EmptyState
					title="Challenge not found"
					description="Go back to the challenges list and choose another challenge."
				/>
			</Card>
		);
	}

	return (
		<div className="challenge-detail-page">
			<ChallengeDetailHeader title={challenge.title} slug={challenge.slug} />
			<ChallengeOverviewCard challenge={challenge} />
			<ChallengeCodeWorkspace
				starterCode={challenge.starter_code}
				code={code}
				isSubmitting={isSubmitting}
				onCodeChange={setCode}
				onRunTests={handleRunTests}
				onResetCode={handleResetCode}
			/>
			<ChallengeResultPanel
				currentResult={currentResult}
				submissionError={submissionError}
			/>
			<ChallengeAttemptHistory submissions={submissions} />
		</div>
	);
}
