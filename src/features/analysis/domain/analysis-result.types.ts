export interface AnalysisResult {
    id: string
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

    createdAt: string
}