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
        const { resumeId, jobId, userId, fileKey, fileName } = jobData;

        try {

            if (!fileKey) {
                throw new Error("Missing fileKey in job payload");
            }

            // Check DB first
            const existingAnalysis = await this.analysisRepo.findByResumeAndJob(
                resumeId,
                jobId
            );

            if (existingAnalysis) {
                console.log("Analysis already exists in DB. Skipping.");
                
                await ResumeRepository.updateAnalysisStatus(
                    resumeId,
                    "processed"
                );
                return;
            }

            //  Check Redis cache
            const cacheKey = `analysis:${jobId}:${resumeId}`;
            const cached = await getCachedAnalysis(cacheKey);

            let analysis;

            if (cached) {
                console.log("Using cached analysis from Redis");
                analysis = cached;
            } else {

                // Download resume
                const signedUrl = await getSignedUrl(fileKey);
                const buffer = await downloadResume(signedUrl);
                const resumeText = await parseResume(buffer, fileName);

                const jobDescription = "FETCH FROM JOB REPO HERE";

                // Call LLM
                analysis = await this.llmService.analyzeResume(
                    resumeText,
                    jobDescription
                );

                // Cache result
                await setCachedAnalysis(cacheKey, analysis);
            }

            // Save once
            await this.analysisRepo.save({
                resumeId,
                jobId,
                userId,

                candidateName: analysis.candidateName,
                email: analysis.email,
                phone: analysis.phone,

                skills: analysis.skills,
                matchedSkills: analysis.matchedSkills,
                missingCriticalSkills: analysis.missingCriticalSkills,

                experience: analysis.experience,

                education: analysis.education,
                softSkills: analysis.softSkills,

                careerLevel: analysis.careerLevel,
                roleFit: analysis.roleFit,

                skillMatchScore: analysis.skillMatchScore,
                experienceMatchScore: analysis.experienceMatchScore,
                educationMatchScore: analysis.educationMatchScore,
                overallFitScore: analysis.overallFitScore,

                interviewProbability: analysis.interviewProbability,

                strengths: analysis.strengths,
                gaps: analysis.gaps,
                riskFlags: analysis.riskFlags,

                recommendations: analysis.recommendations,

                createdAt: new Date(),
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