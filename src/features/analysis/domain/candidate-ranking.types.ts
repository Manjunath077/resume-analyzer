export interface RankedCandidate {
    rank: number;
    resumeId: string;
    candidateName: string;

    overallFitScore: number;
    interviewProbability: number;

    matchedSkills: string[];
    missingCriticalSkills: string[];

    experienceYears: number;
}

export interface JobRankingSummary {
    totalCandidates: number;
    averageScore: number;
    topScore: number;
    lowestScore: number;
}

export interface CandidateRankingResponse {
    jobId: string;

    rankedCandidates: RankedCandidate[];

    summary: JobRankingSummary;
}