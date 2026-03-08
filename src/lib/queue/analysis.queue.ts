import { Queue } from "bullmq";
import { getRedisConnection } from "../redis/redis.connection";
import { AnalysisJobPayload } from "./analysis.job.types";

const connection = getRedisConnection();

export const analysisQueue = new Queue<AnalysisJobPayload>(
    "resume-analysis",
    {
        connection: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            password: process.env.REDIS_PASSWORD,
            maxRetriesPerRequest: null,
        },
        defaultJobOptions: {
            // "If a worker fails to analyze a resume, they get 3 chances to try again. After 3 failures, we mark it as failed."
            attempts: 3,
            // If a job fails, wait before trying again:
            backoff: {
                type: "exponential",
                delay: 5000,
            },
            // Once a resume is successfully analyzed, clean up the workspace. We don't need to keep the work order around!
            removeOnComplete: true,
            // "But if a resume analysis fails, KEEP the work order so we can investigate what went wrong and maybe fix it later."
            removeOnFail: false,
        },
    }
);