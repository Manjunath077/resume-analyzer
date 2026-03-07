import { apiClient } from "@/lib/api/axios";
import {
    FileUploadRequest,
    MetadataResumePayload,
} from "@/features/resume/resume.types";

export const ResumeAPI = {
    async getBatchUploadUrls(jobId: string, files: FileUploadRequest[]) {
        const response = await apiClient.post("/resumes/upload-url", {
            jobId,
            files,
        });

        return response.data;
    },

    async finalizeBatchMetadata(resumes: MetadataResumePayload[]) {
        const response = await apiClient.post("/resumes/metadata", {
            resumes,
        });

        return response.data;
    },
};