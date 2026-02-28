import { NextRequest, NextResponse } from 'next/server';
import { JDService } from '@/services/job-description.service';
import { JobDescriptionUpdateSchema } from '@/validators/job-description.validators';
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
 * GET by ID
 * /api/job-descriptions/user/{userId}/job/{jobId}
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string; jobId: string } }
) {
    try {
        const { userId, jobId } = params;

        const service = await JDService.create();
        const jd = await service.findById(userId, jobId);

        if (!jd) {
            return failure('Job description not found', 404);
        }

        return success(toDTO(jd));

    } catch (error) {
        console.error('GET JD BY ID Error:', error);
        return failure('Internal server error');
    }
}

/**
 * PUT - Update JD
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: { userId: string; jobId: string } }
) {
    try {
        const { userId, jobId } = params;

        const body = await req.json();
        const validatedData = JobDescriptionUpdateSchema.parse(body);

        const service = await JDService.create();
        const updated = await service.updateJD(userId, jobId, validatedData);

        if (!updated) {
            return failure('Job description not found', 404);
        }

        return success(toDTO(updated));

    } catch (error) {
        if (error instanceof ZodError) {
            return failure('Validation failed', 400, error.flatten());
        }

        console.error('UPDATE JD Error:', error);
        return failure('Internal server error');
    }
}

/**
 * DELETE - Delete JD
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: { userId: string; jobId: string } }
) {
    try {
        const { userId, jobId } = params;

        const service = await JDService.create();
        const deleted = await service.deleteJD(userId, jobId);

        if (!deleted) {
            return failure('Job description not found', 404);
        }

        return success({ message: 'Deleted successfully' });

    } catch (error) {
        console.error('DELETE JD Error:', error);
        return failure('Internal server error');
    }
}