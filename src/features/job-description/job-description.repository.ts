import { Db, Collection, ObjectId } from "mongodb";
import { JobDescriptionDocument } from "@/lib/db/job-description.document";
import { JOB_DESCRIPTIONS_COLLECTION } from "@/lib/db/job-description.collection";

export class JobDescriptionRepository {
    private collection: Collection<JobDescriptionDocument>;

    constructor(db: Db) {
        this.collection = db.collection<JobDescriptionDocument>(
            JOB_DESCRIPTIONS_COLLECTION
        );
    }

    async count(filter: any) {
        return this.collection.countDocuments(filter);
    }

    async findMany(
        filter: any,
        sort: any,
        skip: number,
        limit: number
    ): Promise<JobDescriptionDocument[]> {
        return this.collection
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .toArray();
    }

    async findById(userId: string, id: string) {
        if (!ObjectId.isValid(id)) return null;

        return this.collection.findOne({
            _id: new ObjectId(id),
            userId
        });
    }

    async insert(doc: JobDescriptionDocument) {
        const result = await this.collection.insertOne(doc);

        return {
            ...doc,
            _id: result.insertedId
        };
    }

    async update(userId: string, id: string, data: any) {
        if (!ObjectId.isValid(id)) return null;

        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id), userId },
            { $set: data },
            { returnDocument: "after" }
        );

        return result;
    }

    async delete(userId: string, id: string) {
        if (!ObjectId.isValid(id)) return false;

        const result = await this.collection.deleteOne({
            _id: new ObjectId(id),
            userId
        });

        return result.deletedCount === 1;
    }

    async aggregate(pipeline: any[]) {
        return this.collection.aggregate(pipeline).toArray();
    }
}