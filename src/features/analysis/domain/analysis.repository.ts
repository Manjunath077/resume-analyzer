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

}