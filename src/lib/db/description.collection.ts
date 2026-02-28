import { Db } from "mongodb";

export const JOB_DESCRIPTIONS_COLLECTION = "jobDescriptions";

export async function createJobDescriptionsIndexes(db: Db) {
    const collection = db.collection(JOB_DESCRIPTIONS_COLLECTION);

    await collection.createIndex({ userId: 1 });   // Speeds up search by user
    await collection.createIndex({ createdAt: -1 });  // Speeds up sorting by creation date
    await collection.createIndex({ userId: 1, position: 1 });  // Speeds up search by user and position

    console.log("✅ Job descriptions indexes created");
}