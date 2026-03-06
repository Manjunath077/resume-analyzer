import { mongoClient } from "@/lib/mongodb";
import { JobDescriptionRepository } from "./job-description.repository";
import {
    CreateJobDescriptionInput,
    UpdateJobDescriptionInput,
    JobDescriptionQuery
} from "@/validators/job-description.validators";

export class JDService {
    private repo: JobDescriptionRepository;

    constructor(repo: JobDescriptionRepository) {
        this.repo = repo;
    }

    static async create() {
        const db = await mongoClient.getDb();
        const repo = new JobDescriptionRepository(db);
        return new JDService(repo);
    }

    async findAll(userId: string, query: JobDescriptionQuery) {
        const {
            page = 0,
            size = 10,
            search,
            sortBy = "createdAt",
            sortOrder = "desc",
            includeStats = true
        } = query;

        const skip = page * size;

        const filter: any = { userId };

        if (search) {
            filter.$or = [
                { position: { $regex: search, $options: "i" } },
                { requiredSkills: { $in: [new RegExp(search, "i")] } }
            ];
        }

        const totalElements = await this.repo.count(filter);

        const data = await this.repo.findMany(
            filter,
            { [sortBy]: sortOrder === "desc" ? -1 : 1 },
            skip,
            size
        );

        let stats = null;

        if (includeStats) {
            stats = await this.getDashboardStats(userId);
        }

        const totalPages = Math.ceil(totalElements / size);

        return {
            content: data,
            totalElements,
            totalPages,
            size,
            number: page,
            first: page === 0,
            last: page + 1 >= totalPages,
            numberOfElements: data.length,
            empty: data.length === 0,
            stats
        };
    }

    private async getDashboardStats(userId: string) {
        const pipeline = [
            { $match: { userId } },
            {
                $group: {
                    _id: null,
                    totalJDs: { $sum: 1 },
                    totalResumes: { $sum: "$stats.totalResumes" },
                    avgScore: { $avg: "$stats.averageScore" },
                    strongMatches: { $sum: "$stats.strongMatches" }
                }
            }
        ];

        const result = await this.repo.aggregate(pipeline);

        if (!result.length) {
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

    async findById(userId: string, id: string) {
        return this.repo.findById(userId, id);
    }

    async createJD(userId: string, data: CreateJobDescriptionInput) {
        const now = new Date();

        const jd = {
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

        return this.repo.insert(jd as any);
    }

    async updateJD(userId: string, id: string, data: UpdateJobDescriptionInput) {
        return this.repo.update(userId, id, {
            ...data,
            updatedAt: new Date()
        });
    }

    async deleteJD(userId: string, id: string) {
        return this.repo.delete(userId, id);
    }
}