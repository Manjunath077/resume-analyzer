import { NextResponse } from "next/server";
import { CandidateRankingService } from "@/features/analysis/domain/candidate-ranking.service";

export async function GET(
    request: Request,
    context: { params: Promise<{ jobId: string }> }
) {

    const { jobId } = await context.params;

    const rankingService = new CandidateRankingService();

    const result = await rankingService.getJobRanking(jobId);

    return NextResponse.json(result);
}