import { PaginatedResponse } from './paginated-response.d';
export interface FileUploadRequest {
    fileName: string;
    fileType: string;
    fileSize: number;
}

export interface UploadUrlResponse {
    success: boolean;
    data: {
        uploads: {
            fileKey: string;
            uploadUrl: string;
            expiresIn: number;
        }[];
    };
}

export interface MetadataResumePayload {
    fileKey: string;
    candidateName: string;
}

export type UploadStatus =
    | "pending"
    | "uploading"
    | "uploaded"
    | "finalizing"
    | "completed"
    | "failed";


export interface ResumeMetadataDto {
  _id: string;
  fileKey: string;
  candidateName: string;
  status: "uploaded" | "processed" | "failed";
  analysisStatus: "not_processed" | "processing" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export const ResumeMetadataResponse = PaginatedResponse<ResumeMetadataDto>;