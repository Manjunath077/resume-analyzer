// Purpose: This service is responsible for:
// finding resumes
// marking them queued
// pushing jobs to BullMQ

// Used by: API routeimport { analysisQueue } from "@/lib/queue/analysis.queue";

import { AnalysisJobPayload } from "@/lib/queue/analysis.job.types";
import { ResumeRepository } from "@/features/resume/domain/resume.repository";
import { analysisQueue } from "@/lib/queue/analysis.queue";

export class AnalysisQueueService {
  async queueAnalysis(jobId: string, userId: string) {

    const resumes = await ResumeRepository.findByJobId(jobId);

    if (!resumes.length) {
      return 0;
    }

    const jobs: AnalysisJobPayload[] = [];

    for (const resume of resumes) {
      // You need to implement updateAnalysisStatus as well
      await ResumeRepository.updateAnalysisStatus(
        resume._id.toString(), 
        "queued"
      );

      jobs.push({
        resumeId: resume._id.toString(),
        jobId,
        userId,
        fileUrl: resume.fileUrl,
      });
    }

    await analysisQueue.addBulk(
      jobs.map((job) => ({
        name: "analyze-resume",
        data: job,
      }))
    );

    return jobs.length;
  }
}