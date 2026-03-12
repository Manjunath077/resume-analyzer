// Purpose:
// Handles all database operations related to resume analysis

import { AnalysisDocument, getAnalysisCollection } from "./analysis.document";

export class AnalysisRepository {

    async save(data: Omit<AnalysisDocument, "_id">) {
        const collection = await getAnalysisCollection();

        const result = await collection.insertOne({
            ...data,
            createdAt: new Date(),
        });

        return result.insertedId;
    }


    async findAll(jobId: string, page: number, size: number) {
        const collection = await getAnalysisCollection();

        const skip = page * size;

        const filter = {
            jobId: jobId
        };

        const cursor = collection
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(size);

        const content = await cursor.toArray();

        const totalElements = await collection.countDocuments(filter);

        return {
            content,
            totalElements,
        };
    }

    async findByResumeId(resumeId: string) {
        const collection = await getAnalysisCollection();
        const result = await collection.findOne({
            resumeId: resumeId
        });
        return result;
    }
}