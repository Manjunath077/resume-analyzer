export type ResumeStatus = "pending" | "uploaded" | "processed" | "failed";

export type AnalysisStatus =
    | "not_started"
    | "queued"
    | "processing"
    | "completed"
    | "error";

export interface Resume {
    _id?: string;
    fileKey: string;
    fileName: string;
    jobId: string;
    userId: string;
    candidateName?: string;
    yearsOfExperience?: number;
    skills?: string[];
    status: ResumeStatus;
    analysisStatus: AnalysisStatus;
    fileSize: number;
    fileType: string;
    createdAt: Date;
    updatedAt?: Date;
}