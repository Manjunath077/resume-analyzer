export interface AnalysisResult {
    candidateName: string;
    email: string;
    phone: string;
    skills: string[];
    experience: {
        total: number;
        companies: string[];
        relevantProjects: string[];
    };
    education: string[];
    softSkills: string[];
    matchScore: number;
    strengths: string[];
    gaps: string[];
    recommendations: string;
}