import { apiClient } from "@/lib/api/axios";

export const JobDescriptionAPI = {
  getAll: (userId: string, params?: any) =>
    apiClient.get(`/job-descriptions/user/${userId}`, { params }),

  getById: (userId: string, jobId: string) =>
    apiClient.get(`/job-descriptions/user/${userId}/job/${jobId}`),

  create: (userId: string, data: any) =>
    apiClient.post(`/job-descriptions/user/${userId}`, data),

  update: (userId: string, jobId: string, data: any) =>
    apiClient.put(`/job-descriptions/user/${userId}/job/${jobId}`, data),

  delete: (userId: string, jobId: string) =>
    apiClient.delete(`/job-descriptions/user/${userId}/job/${jobId}`),
};