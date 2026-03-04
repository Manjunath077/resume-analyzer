import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { ResumeService } from "@/services/resume.service";

const resumeService = new ResumeService();

// POST /api/resumes/metadata
export async function POST(req: NextRequest) {
    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token?.sub) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { resumes } = await req.json();

        if (!Array.isArray(resumes) || resumes.length === 0) {
            return NextResponse.json(
                { success: false, message: "Invalid payload" },
                { status: 400 }
            );
        }

        const results = await resumeService.updateMetadataBulk(
            token.sub,
            resumes
        );

        return NextResponse.json({
            success: true,
            data: results,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// GET /api/resumes/metadata?page=0&size=10&jobId=xxx&userId=xxx
export async function GET(req: NextRequest) {
    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token?.sub) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);

        const page = Number(searchParams.get("page") || 0);
        const size = Number(searchParams.get("size") || 10);
        const jobId = searchParams.get("jobId");
        const userIdParam = searchParams.get("userId");

        const result = await resumeService.getResumes(token.sub, {
            page,
            size,
            jobId,
            userIdParam,
        });

        return NextResponse.json({
            content: result.content,
            ...result.pagination,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// DELETE /api/resumes/metadata?resumeId=xxx
export async function DELETE(req: NextRequest) {
    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token?.sub) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const resumeId = searchParams.get("resumeId");

        if (!resumeId) {
            return NextResponse.json(
                { success: false, message: "resumeId is required" },
                { status: 400 }
            );
        }

        await resumeService.deleteResume(resumeId, token.sub);

        return NextResponse.json({
            success: true,
            message: "Resume deleted successfully",
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}