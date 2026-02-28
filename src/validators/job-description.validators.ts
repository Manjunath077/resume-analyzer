import { z } from 'zod';

// Experience validation schema
export const ExperienceRequiredSchema = z.object({
    minYears: z.number().min(0).max(50),
    maxYears: z.number().min(0).max(50).optional()
}).refine(data => {
    // If maxYears is provided, it should be >= minYears
    if (data.maxYears !== undefined && data.maxYears < data.minYears) {
        return false;
    }
    return true;
}, {
    message: "maxYears must be greater than or equal to minYears",
    path: ["maxYears"]
});

// Statistics validation schema
export const StatisticsSchema = z.object({
    totalResumes: z.number().min(0).default(0),
    strongMatches: z.number().min(0).default(0),
    averageScore: z.number().min(0).max(100).default(0)
}).optional();

// Main Job Description validation schema
export const JobDescriptionSchema = z.object({
    position: z.string().min(1, "Position title is required").max(200),
    experienceRequired: ExperienceRequiredSchema,
    requiredSkills: z.array(z.string().min(1)).min(1, "At least one required skill is needed"),
    requiredQualifications: z.array(z.string().min(1)).optional(),
    niceToHaveSkills: z.array(z.string().min(1)).optional(),
    niceToHaveQualifications: z.array(z.string().min(1)).optional(),
    responsibilities: z.array(z.string().min(1)).min(1, "At least one responsibility is needed"),
    stats: StatisticsSchema
});

// Schema for updating (all fields optional)
export const JobDescriptionUpdateSchema = JobDescriptionSchema.partial();

// Schema for ID parameter
export const IdParamSchema = z.object({
    id: z.string().length(24, "Invalid MongoDB ID format") // MongoDB ObjectId is 24 chars
});

// Schema for query parameters (pagination, filtering)
export const JobDescriptionQuerySchema = z.object({
    page: z.coerce.number().min(0).default(0),
    size: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    sortBy: z.enum(['createdAt', 'position', 'updatedAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    includeStats: z.coerce.boolean().default(true)
});

export type CreateJobDescriptionInput = z.infer<typeof JobDescriptionSchema>;
export type UpdateJobDescriptionInput = z.infer<typeof JobDescriptionUpdateSchema>;
export type JobDescriptionQuery = z.infer<typeof JobDescriptionQuerySchema>;