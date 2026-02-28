import { mongoClient } from '@/lib/mongodb';
import { ObjectId, Db, Collection } from 'mongodb';
import {
    CreateJobDescriptionInput,
    UpdateJobDescriptionInput,
    JobDescriptionQuery
} from '@/validators/job-description.validators';
import { JOB_DESCRIPTIONS_COLLECTION } from '../lib/db/description.collection';
import { JobDescriptionDocument } from '@/lib/db/job-description.document';

export class JDService {
    private db: Db;
    private collection: Collection<JobDescriptionDocument>;

    constructor(db: Db) {
        this.db = db;
        this.collection = this.db.collection<JobDescriptionDocument>(
            JOB_DESCRIPTIONS_COLLECTION
        );
    }

    static async create(): Promise<JDService> {
        const db = await mongoClient.getDb();
        return new JDService(db);
    }

    /*** Unified GET API
     * Handles:
     * - Pagination
     * - Search
     * - Sorting
     * - Dashboard stats
     */
    async findAll(userId: string, query: JobDescriptionQuery) {
        const {
            page = 0,
            size = 10,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            includeStats = true
        } = query;

        const skip = page * size;

        const filter: any = { userId };

        if (search) {
            filter.$or = [
                { position: { $regex: search, $options: 'i' } },
                { requiredSkills: { $in: [new RegExp(search, 'i')] } },
                { responsibilities: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const totalElements = await this.collection.countDocuments(filter);

        const data = await this.collection
            .find(filter)
            .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(size)
            .toArray();

        let stats = null;

        if (includeStats) {
            stats = await this.getDashboardStats(userId);
        }

        const totalPages = Math.ceil(totalElements / size);

        return {
            content: data,

            pageable: {
                sort: {
                    empty: false,
                    unsorted: false,
                    sorted: true
                },
                offset: skip,
                pageNumber: page,
                pageSize: size,
                paged: true,
                unpaged: false
            },

            last: page + 1 >= totalPages,
            totalPages,
            totalElements,
            first: page === 0,
            size,
            number: page,
            sort: {
                empty: false,
                unsorted: false,
                sorted: true
            },
            numberOfElements: data.length,
            empty: data.length === 0,

            stats // 👈 dashboard stats included here
        };
    }

    /*** Dashboard Aggregated Stats*/
    private async getDashboardStats(userId: string) {
        const pipeline = [
            { $match: { userId } },
            {
                $group: {
                    _id: null,
                    totalJDs: { $sum: 1 },
                    totalResumes: { $sum: '$stats.totalResumes' },
                    avgScore: { $avg: '$stats.averageScore' },
                    strongMatches: { $sum: '$stats.strongMatches' }
                }
            }
        ];

        const result = await this.collection.aggregate(pipeline).toArray();

        if (result.length === 0) {
            return {
                totalJDs: 0,
                totalResumes: 0,
                averageScore: 0,
                strongMatches: 0
            };
        }

        return {
            totalJDs: result[0].totalJDs,
            totalResumes: result[0].totalResumes || 0,
            averageScore: Math.round(result[0].avgScore || 0),
            strongMatches: result[0].strongMatches || 0
        };
    }

    /*** Get JD By ID */
    async findById(
        userId: string,
        id: string
    ): Promise<JobDescriptionDocument | null> {
        if (!ObjectId.isValid(id)) return null;

        return await this.collection.findOne({
            _id: new ObjectId(id),
            userId
        });
    }

    /*** Create JD*/
    async createJD(
        userId: string,
        data: CreateJobDescriptionInput
    ): Promise<JobDescriptionDocument> {
        const now = new Date();

        const jobDescription: JobDescriptionDocument = {
            ...data,
            userId,
            stats: {
                totalResumes: 0,
                strongMatches: 0,
                averageScore: 0
            },
            createdAt: now,
            updatedAt: now
        };

        const result = await this.collection.insertOne(jobDescription);

        return {
            ...jobDescription,
            _id: result.insertedId
        };
    }

    /*** Update JD*/
    async updateJD(
        userId: string,
        id: string,
        data: UpdateJobDescriptionInput
    ) {
        if (!ObjectId.isValid(id)) return null;

        return await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id), userId },
            { $set: { ...data, updatedAt: new Date() } },
            { returnDocument: 'after' }
        );
    }

    /*** Delete JD*/
    async deleteJD(userId: string, id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) return false;

        const result = await this.collection.deleteOne({
            _id: new ObjectId(id),
            userId
        });

        return result.deletedCount === 1;
    }
}