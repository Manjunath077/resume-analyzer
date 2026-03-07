import { bucket } from "@/lib/gcp/storage";
import { ResumeRepository } from "@/features/resume/domain/resume.repository";

export class ResumeService {
    constructor(
        private readonly resumeRepository = ResumeRepository
    ) { }

    async deleteResume(resumeId: string, userId: string) {
        // 1️⃣ Check if resume exists and belongs to user
        const resume = await this.resumeRepository.findByIdAndUser(
            resumeId,
            userId
        );

        if (!resume) {
            throw new Error("Resume not found or unauthorized");
        }

        const fileKey = resume.fileKey;

        // 2️⃣ Delete file from GCS bucket
        const file = bucket.file(fileKey);
        const [exists] = await file.exists();

        if (exists) {
            await file.delete();
        }

        // 3️⃣ Delete DB record
        await this.resumeRepository.deleteById(resumeId);

        return true;
    }

    async finalizeUpload(
        fileKey: string,
        userId: string,
        metadata: {
            candidateName: string;
            yearsOfExperience: number;
            skills: string[];
        }
    ): Promise<boolean> {
        const resume = await this.resumeRepository.findPendingByFileKey(
            fileKey,
            userId
        );

        if (!resume) {
            throw new Error("Pending resume not found or unauthorized");
        }

        const [exists] = await bucket.file(fileKey).exists();

        if (!exists) {
            throw new Error("File not found in cloud storage");
        }

        await this.resumeRepository.updateToUploaded(resume._id.toString(), {
            candidateName: metadata.candidateName,
            yearsOfExperience: metadata.yearsOfExperience,
            skills: metadata.skills,
        });

        await this.triggerAnalysis(resume._id.toString());

        return true;
    }

    async updateMetadataBulk(
        userId: string,
        resumes: { fileKey: string; candidateName: string }[]
    ) {
        const results = [];

        for (const resume of resumes) {
            const { fileKey, candidateName } = resume;

            if (!fileKey || !candidateName) continue;

            const existing = await this.resumeRepository.findPendingByFileKey(
                fileKey,
                userId
            );

            if (!existing) continue;

            const [exists] = await bucket.file(fileKey).exists();
            if (!exists) continue;

            await this.resumeRepository.updateToUploaded(existing._id.toString(), {
                candidateName,
            });

            results.push({ fileKey, status: "uploaded" });
        }

        return results;
    }

    async getResumes(
        loggedInUserId: string,
        options: {
            page: number;
            size: number;
            jobId?: string | null;
            userIdParam?: string | null;
        }
    ) {
        const { page, size, jobId, userIdParam } = options;

        const skip = page * size;

        const query: any = {
            status: { $ne: "pending" },
            userId: userIdParam || loggedInUserId,
        };

        if (jobId) {
            query.jobId = jobId;
        }

        const totalElements = await this.resumeRepository.count(query);

        const content = await this.resumeRepository.findAll(
            query,
            skip,
            size
        );

        const totalPages = Math.ceil(totalElements / size);

        return {
            content,
            pagination: {
                page,
                size,
                totalElements,
                totalPages,
                numberOfElements: content.length,
                first: page === 0,
                last: page + 1 >= totalPages,
                empty: content.length === 0,
            },
        };
    }

    private async triggerAnalysis(resumeId: string) {
        console.log("Resume queued for analysis:", resumeId);
        return true;
    }
}