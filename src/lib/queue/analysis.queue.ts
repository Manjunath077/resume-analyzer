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
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        },
    }
);