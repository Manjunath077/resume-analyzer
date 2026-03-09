import { NextResponse } from "next/server";
import { AnalysisRepository } from "@/features/analysis/domain/analysis.repository";

export async function GET(
    req: Request,
    { params }: { params: { resumeId: string } }
) {

    try {

        const repo = new AnalysisRepository();

        const analysis =
            await repo.findByResumeId(params.resumeId);

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