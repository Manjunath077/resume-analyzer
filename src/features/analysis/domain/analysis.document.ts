// Purpose:
// 1. Define the Analysis document TypeScript type
// 2. Provide a helper to access the MongoDB collection

import { ObjectId, Collection } from "mongodb";
import { mongoClient } from "@/lib/db/mongodb";

export interface AnalysisDocument {
    _id?: string

    resumeId: string
    jobId: string
    userId: string

    candidateName: string
    email: string
    phone: string

    skills: string[]
    matchedSkills: string[]
    missingCriticalSkills: string[]

    experience: {
        total: number
        companies: string[]
        relevantProjects: string[]
    }

    education: string[]
    softSkills: string[]

    careerLevel: string
    roleFit: string

    skillMatchScore: number
    experienceMatchScore: number
    educationMatchScore: number
    overallFitScore: number

    interviewProbability: number

    strengths: string[]
    gaps: string[]
    riskFlags: string[]

    recommendations: string

    createdAt: Date
}

export async function getAnalysisCollection(): Promise<Collection<AnalysisDocument>> {
    const db = await mongoClient.getDb(); // Await the database
    return db.collection<AnalysisDocument>("resume_analysis");
}