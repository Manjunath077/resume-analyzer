// Purpose:
// 1. Define the Analysis document TypeScript type
// 2. Provide a helper to access the MongoDB collection

import { ObjectId, Collection } from "mongodb";
import { mongoClient } from "@/lib/db/mongodb";

export interface AnalysisDocument {
    _id?: ObjectId;

    resumeId: string;
    jobId: string;
    userId: string;

    score?: number;
    summary?: string;

    createdAt: Date;
}

export async function getAnalysisCollection(): Promise<Collection<AnalysisDocument>> {
    const db = await mongoClient.getDb(); // Await the database
    return db.collection<AnalysisDocument>("resume_analysis");
}