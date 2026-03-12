import { AnalysisRepository } from "./analysis.repository";
import {
    CandidateRankingResponse,
    RankedCandidate,
} from "./candidate-ranking.types";

export class CandidateRankingService {

    private analysisRepo = new AnalysisRepository();

    async getJobRanking(jobId: string): Promise<CandidateRankingResponse> {

        const analyses = await this.analysisRepo.findByJobId(jobId);

        if (!analyses || analyses.length === 0) {
            return {
                jobId,
                rankedCandidates: [],
                summary: {
                    totalCandidates: 0,
                    averageScore: 0,
                    topScore: 0,
                    lowestScore: 0,
                },
            };
        }

        // Sort candidates by overallFitScore
        const sorted = analyses.sort(
            (a, b) => (b.overallFitScore || 0) - (a.overallFitScore || 0)
        );

        const rankedCandidates: RankedCandidate[] = sorted.map((candidate, index) => ({
            rank: index + 1,

            resumeId: candidate.resumeId,
            candidateName: candidate.candidateName,

            overallFitScore: candidate.overallFitScore || 0,
            interviewProbability: candidate.interviewProbability || 0,

            matchedSkills: candidate.matchedSkills || [],
            missingCriticalSkills: candidate.missingCriticalSkills || [],

            experienceYears: candidate.experience?.total || 0,
        }));


        const scores = rankedCandidates.map(c => c.overallFitScore);

        const totalCandidates = rankedCandidates.length;

        const averageScore =
            scores.reduce((sum, score) => sum + score, 0) / totalCandidates;

        const topScore = Math.max(...scores);

        const lowestScore = Math.min(...scores);

        return {
            jobId,

            rankedCandidates,

            summary: {
                totalCandidates,
                averageScore: Math.round(averageScore),
                topScore,
                lowestScore,
            },
        };
    }
}