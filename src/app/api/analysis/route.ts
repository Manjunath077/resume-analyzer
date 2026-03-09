import { NextRequest, NextResponse } from "next/server";
import { AnalysisRepository } from "@/features/analysis/domain/analysis.repository";

export async function GET(req: NextRequest) {
    try {

        const { searchParams } = new URL(req.url);

        const jobId = searchParams.get("jobId");
        const page = Number(searchParams.get("page") ?? 0);
        const size = Number(searchParams.get("size") ?? 10);

        // Validate jobId
        if (!jobId) {
            return NextResponse.json(
                { error: "jobId query param is required" },
                { status: 400 }
            );
        }

        const repo = new AnalysisRepository();

        const { content, totalElements } =
            await repo.findAll(jobId, page, size);

        const totalPages = Math.ceil(totalElements / size);

        const response = {
            content,
            pageable: {
                sort: {
                    empty: false,
                    unsorted: false,
                    sorted: true
                },
                offset: page * size,
                pageNumber: page,
                pageSize: size,
                paged: true,
                unpaged: false
            },
            last: page + 1 >= totalPages,
            totalPages,
            totalElements,
            first: page === 0,
            size,
            number: page,
            sort: {
                empty: false,
                unsorted: false,
                sorted: true
            },
            numberOfElements: content.length,
            empty: content.length === 0
        };

        return NextResponse.json(response);

    } catch (error) {

        console.error("Fetch analysis error:", error);

        return NextResponse.json(
            { error: "Failed to fetch analysis list" },
            { status: 500 }
        );
    }
}