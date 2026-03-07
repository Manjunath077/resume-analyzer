import clientPromise from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

export const ResumeRepository = {
    async findPendingByFileKey(fileKey: string, userId: string) {
        const client = await clientPromise;
        const db = client.db();

        return db.collection("resumes").findOne({
            fileKey,
            userId,
            status: "pending",
        });
    },

    async findByIdAndUser(resumeId: string, userId: string) {
        const client = await clientPromise;
        const db = client.db();

        return db.collection("resumes").findOne({
            _id: new ObjectId(resumeId),
            userId,
        });
    },

    async deleteById(resumeId: string) {
        const client = await clientPromise;
        const db = client.db();

        return db.collection("resumes").deleteOne({
            _id: new ObjectId(resumeId),
        });
    },

    async updateToUploaded(resumeId: string, updateData: any) {
        const client = await clientPromise;
        const db = client.db();

        return db.collection("resumes").updateOne(
            { _id: new ObjectId(resumeId) },
            {
                $set: {
                    ...updateData,
                    status: "uploaded",
                    analysisStatus: "queued",
                    updatedAt: new Date(),
                },
            }
        );
    },

    async count(query: any) {
        const client = await clientPromise;
        const db = client.db();

        return db.collection("resumes").countDocuments(query);
    },

    async findAll(query: any, skip: number, size: number) {
        const client = await clientPromise;
        const db = client.db();

        return db
            .collection("resumes")
            .find(query)
            .project({
                _id: 1,
                fileKey: 1,
                candidateName: 1,
                jobId: 1,
                userId: 1,
                status: 1,
                analysisStatus: 1,
                createdAt: 1,
                updatedAt: 1,
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(size)
            .toArray();
    },

    // Add the missing methods
    async findByJobId(jobId: string) {
        const client = await clientPromise;
        const db = client.db();

        return db
            .collection("resumes")
            .find({ jobId })
            .toArray();
    },

    async updateAnalysisStatus(resumeId: string, status: string) {
        const client = await clientPromise;
        const db = client.db();

        return db.collection("resumes").updateOne(
            { _id: new ObjectId(resumeId) },
            {
                $set: {
                    analysisStatus: status,
                    updatedAt: new Date(),
                },
            }
        );
    }
};