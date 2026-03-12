// Defines structured output from LLM.

export interface ExperienceInfo {
    total: number
    companies: string[]
    relevantProjects: string[]
}

export interface LLMAnalysisResult {
    candidateName: string
    email: string
    phone: string

    skills: string[]
    matchedSkills: string[]
    missingCriticalSkills: string[]

    experience: ExperienceInfo

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
}