import type {
	ChallengeDifficulty,
	ChallengeFilters,
	ChallengeLanguage,
	PublicChallenge,
} from "../types/challenge.types";
import type { SubmitEvent } from "react";
import { useEffect, useState } from "react";
import { Button } from "../../../shared/ui/Button/Button";
import { Card } from "../../../shared/ui/Card/Card";
import { EmptyState } from "../../../shared/ui/EmptyState/EmptyState";
import { ErrorState } from "../../../shared/ui/ErrorState/ErrorState";
import { LoadingState } from "../../../shared/ui/LoadingState/LoadingState";
import { ChallengeCard } from "../components/ChallengeCard";
import { challengeService } from "../services/challengeService";
import "./ChallengesPage.css";

const initialFilters: ChallengeFilters = {
	search: "",
	difficulty: "",
	topic: "",
	language: "",
};

export function ChallengesPage() {
	const [challenges, setChallenges] = useState<PublicChallenge[]>([]);
	const [filters, setFilters] = useState<ChallengeFilters>(initialFilters);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	async function loadChallenges(currentFilters: ChallengeFilters) {
		setIsLoading(true);
		setError("");

		try {
			const data = await challengeService.getChallenges(currentFilters);
			setChallenges(data);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Could not load challenges";

			setError(message);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		void loadChallenges(initialFilters);
	}, []);

	function handleSearchChange(value: string) {
		setFilters((currentFilters) => ({
			...currentFilters,
			search: value,
		}));
	}

	function handleDifficultyChange(value: ChallengeDifficulty | "") {
		setFilters((currentFilters) => ({
			...currentFilters,
			difficulty: value,
		}));
	}

	function handleTopicChange(value: string) {
		setFilters((currentFilters) => ({
			...currentFilters,
			topic: value,
		}));
	}

	function handleLanguageChange(value: ChallengeLanguage | "") {
		setFilters((currentFilters) => ({
			...currentFilters,
			language: value,
		}));
	}

	function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		void loadChallenges(filters);
	}

	function handleClearFilters() {
		setFilters(initialFilters);
		void loadChallenges(initialFilters);
	}

	return (
		<div className="challenges-page">
			<div className="challenges-header">
				<h1>Challenges</h1>
				<p className="challenges-muted">
					Practice coding problems and filter them by difficulty, topic, or
					language.
				</p>
			</div>

			<Card>
				<form className="challenges-filters" onSubmit={handleSubmit}>
					<input
						name="search"
						value={filters.search}
						onChange={(event) => handleSearchChange(event.target.value)}
						placeholder="Search by title"
					/>

					<select
						name="difficulty"
						value={filters.difficulty}
						onChange={(event) =>
							handleDifficultyChange(
								event.target.value as ChallengeDifficulty | ""
							)
						}
					>
						<option value="">All difficulties</option>
						<option value="easy">easy</option>
						<option value="medium">medium</option>
						<option value="hard">hard</option>
					</select>

					<input
						name="topic"
						value={filters.topic}
						onChange={(event) => handleTopicChange(event.target.value)}
						placeholder="Topic"
					/>

					<select
						name="language"
						value={filters.language}
						onChange={(event) =>
							handleLanguageChange(event.target.value as ChallengeLanguage | "")
						}
					>
						<option value="">All languages</option>
						<option value="javascript">javascript</option>
						<option value="typescript">typescript</option>
						<option value="sql">sql</option>
					</select>

					<Button type="submit">Search</Button>

					<Button
						type="button"
						variant="secondary"
						onClick={handleClearFilters}
					>
						Clear
					</Button>
				</form>
			</Card>

			{error && <ErrorState message={error} />}

			{isLoading && <LoadingState message="Loading challenges..." />}

			{!isLoading && !error && challenges.length === 0 && (
				<Card>
					<EmptyState
						title="No challenges found"
						description="Try changing the filters or create published challenges from the admin panel."
					/>
				</Card>
			)}

			{!isLoading && !error && challenges.length > 0 && (
				<div className="challenges-list">
					{challenges.map((challenge) => (
						<ChallengeCard key={challenge.id} challenge={challenge} />
					))}
				</div>
			)}
		</div>
	);
}