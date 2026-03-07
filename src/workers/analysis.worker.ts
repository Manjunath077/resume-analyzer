// This file: Listens to BullMQ queue , Executes analysis pipeline
// Responsibilities:
// receive job
//      ↓
// download resume
//      ↓
// parse resume
//      ↓
// run AI analysis
//      ↓
// store result
//      ↓
// update status

import { Worker } from "bullmq";
import { AnalysisJobPayload } from "@/lib/queue/analysis.job.types";
import { AnalysisProcessorService } from '@/features/analysis/domain/analysis.processor.service';

const processor = new AnalysisProcessorService();

new Worker<AnalysisJobPayload>(
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