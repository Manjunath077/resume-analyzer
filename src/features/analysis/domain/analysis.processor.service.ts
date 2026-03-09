// Purpose, This service runs full analysis pipeline:
// download resume
// parse text
// fetch job description
// call GROQ
// store analysis result
// update status

// Worker just calls this service.


import { downloadResume } from "@/features/resume/processing/resume.downloader";
import { parseResume } from "@/features/resume/processing/resume.parser";
import { AnalysisRepository } from "./analysis.repository";
import { ResumeRepository } from "@/features/resume/domain/resume.repository";
import { getSignedUrl } from "@/lib/gcp/gcp.storage.service";
import { AnalysisJobPayload } from "@/lib/queue/analysis.job.types";
import { LLMAnalysisService } from "@/lib/llm/services/llm-analysis.service";
import { getCachedAnalysis, setCachedAnalysis } from "@/lib/cache/analysis.cache";

export class AnalysisProcessorService {

    private analysisRepo = new AnalysisRepository();
    private llmService = new LLMAnalysisService();

    async process(jobData: AnalysisJobPayload) {
        const { resumeId, jobId, userId, fileKey, fileName, fileType } = jobData;

        try {

            if (!jobData.fileKey) {
                throw new Error("Missing fileKey in job payload");
            }

            const signedUrl = await getSignedUrl(fileKey);

            console.log("Downloading resume from:", signedUrl);

            const buffer = await downloadResume(signedUrl);

            const resumeText = await parseResume(buffer, fileName);

            // TEMP fake score
            const cacheKey = `analysis:${jobId}:${resumeId}`;
            const cached = await getCachedAnalysis(cacheKey);
            let analysis;
            if (cached) {
                console.log("Using cached analysis");
                analysis = cached;
            } else {
                const jobDescription = "FETCH FROM JOB REPO HERE";

                analysis = await this.llmService.analyzeResume(
                    resumeText,
                    jobDescription
                );
                await setCachedAnalysis(cacheKey, analysis);
            }

            await this.analysisRepo.save({
                resumeId,
                jobId,
                userId,
                candidateName: analysis.candidateName,
                email: analysis.email,
                phone: analysis.phone,
                score: analysis.matchScore,
                skills: analysis.skills,
                experience: analysis.experience,
                education: analysis.education,
                softSkills: analysis.softSkills,
                strengths: analysis.strengths,
                gaps: analysis.gaps,
                recommendations: analysis.recommendations,
                createdAt: new Date()
            });

            await ResumeRepository.updateAnalysisStatus(
                resumeId,
                "processed"
            );

        } catch (error) {

            await ResumeRepository.updateAnalysisStatus(
                resumeId,
                "failed"
            );

            throw error;
        }
    }
}