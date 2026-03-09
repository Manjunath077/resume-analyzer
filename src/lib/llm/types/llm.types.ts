// Defines structured output from LLM.
export interface ExperienceInfo {
    total: number;
    companies: string[];
    relevantProjects: string[];
}

export interface LLMAnalysisResult {
    candidateName: string;
    email: string;
    phone: string;

    skills: string[];
    experience: ExperienceInfo;

    education: string[];
    softSkills: string[];

    matchScore: number;

    strengths: string[];
    gaps: string[];

    recommendations: string;
}