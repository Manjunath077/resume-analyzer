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

export class AnalysisProcessorService {

    private analysisRepo = new AnalysisRepository();

    async process(jobData: any) {
        const { resumeId, jobId, userId, fileUrl } = jobData;

        try {
            const buffer = await downloadResume(fileUrl);

            const resumeText = await parseResume(buffer, fileUrl);

            // TEMP fake score
            const score = Math.floor(Math.random() * 100);

            await this.analysisRepo.save({
                resumeId,
                jobId,
                userId,
                score,
                summary: resumeText.slice(0, 500),
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