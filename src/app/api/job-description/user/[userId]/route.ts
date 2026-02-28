import { NextRequest, NextResponse } from 'next/server';
import { JDService } from '@/services/job-description.service';
import {
    JobDescriptionSchema,
    JobDescriptionQuerySchema
} from '@/validators/job-description.validators';
import { ZodError } from 'zod';

function success(data: any, status = 200) {
    return NextResponse.json({ success: true, data }, { status });
}

function failure(message: string, status = 500, errors?: any) {
    return NextResponse.json(
        { success: false, message, ...(errors && { errors }) },
        { status }
    );
}

function toDTO(doc: any) {
    return {
        _id: doc._id.toString(),
        userId: doc.userId,
        position: doc.position,
        experienceRequired: doc.experienceRequired,
        requiredSkills: doc.requiredSkills,
        requiredQualifications: doc.requiredQualifications,
        niceToHaveSkills: doc.niceToHaveSkills,
        niceToHaveQualifications: doc.niceToHaveQualifications,
        responsibilities: doc.responsibilities,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString()
    };
}

/**
 * GET - List with Pagination + Search
 * /api/job-descriptions/user/{userId}?page=1&size=10&search=react
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        const { searchParams } = new URL(req.url);

        const query = JobDescriptionQuerySchema.parse({
            page: searchParams.get('page'),
            size: searchParams.get('size'),
            search: searchParams.get('search'),
            sortBy: searchParams.get('sortBy'),
            sortOrder: searchParams.get('sortOrder'),
            includeStats: searchParams.get('includeStats')
        });

        const service = await JDService.create();

        const result = await service.findAll(userId, query);

        return NextResponse.json(
            {
                ...result,
                content: result.content.map(toDTO)
            },
            { status: 200 }
        );

    } catch (error) {
        if (error instanceof ZodError) {
            return failure('Validation failed', 400, error.flatten());
        }

        console.error('GET JD Error:', error);
        return failure('Internal server error');
    }
}

/**
 * POST - Create JD
 * /api/job-descriptions/user/{userId}
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        const body = await req.json();
        const validatedData = JobDescriptionSchema.parse(body);

        const service = await JDService.create();
        const created = await service.createJD(userId, validatedData);

        return NextResponse.json(toDTO(created), { status: 201 });

    } catch (error) {
        if (error instanceof ZodError) {
            return failure('Validation failed', 400, error.flatten());
        }

        console.error('CREATE JD Error:', error);
        return failure('Internal server error');
    }
}