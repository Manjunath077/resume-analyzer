import "@/lib/env"; 

import { Worker } from "bullmq";
import { AnalysisJobPayload } from "@/lib/queue/analysis.job.types";
import { AnalysisProcessorService } from '@/features/analysis/domain/analysis.processor.service';

const processor = new AnalysisProcessorService();

export const analysisWorker = new Worker<AnalysisJobPayload>(
    "resume-analysis",
    async (job) => {
        console.log("Processing job:", job.id);
        await processor.process(job.data);
    },
    {
        connection: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            password: process.env.REDIS_PASSWORD,
            maxRetriesPerRequest: null,
        },
        concurrency: 5,
    }
);

analysisWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

analysisWorker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed`, err);
});