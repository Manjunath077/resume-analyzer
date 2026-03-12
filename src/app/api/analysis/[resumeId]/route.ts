import { NextResponse } from "next/server";
import { AnalysisRepository } from "@/features/analysis/domain/analysis.repository";

export async function GET(
    req: Request,
    context: { params: Promise<{ resumeId: string }> }
) {
    try {
        const { resumeId } = await context.params;

        const repo = new AnalysisRepository();

        const analysis = await repo.findByResumeId(resumeId);

        if (!analysis) {
            return NextResponse.json(
                { message: "Analysis not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(analysis);

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch analysis" },
            { status: 500 }
        );
    }
}