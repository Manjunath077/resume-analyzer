"use client";

import { useState } from "react";
import { ResumeAPI } from "@/lib/api/resume.api";

export type UploadStatus =
    | "pending"
    | "uploading"
    | "uploaded"
    | "completed"
    | "failed";

export interface UploadItem {
    id: string; // unique stable id
    file: File;
    candidateName: string;
    fileKey?: string;
    status: UploadStatus;
    progress: number;
}

export function useResumeUpload(jobId: string) {
    const [uploads, setUploads] = useState<UploadItem[]>([]);
    const [finalLoading, setFinalLoading] = useState(false);

    // Add Files (Append + Deduplicate)
    const handleFilesSelected = (files: FileList) => {
        const fileArray = Array.from(files);

        const validated = fileArray.filter(
            (file) =>
                file.size <= 5 * 1024 * 1024 &&
                [
                    "application/pdf",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ].includes(file.type)
        );

        setUploads((prev) => {
            const existingNames = new Set(
                prev.map((p) => p.file.name + p.file.size)
            );

            const newItems: UploadItem[] = validated
                .filter(
                    (file) => !existingNames.has(file.name + file.size)
                )
                .map((file) => ({
                    id: crypto.randomUUID(),
                    file,
                    candidateName: file.name.replace(/\.[^/.]+$/, ""),
                    status: "pending",
                    progress: 0,
                }));

            return [...prev, ...newItems].slice(0, 10);
        });
    };

    // Remove File
    const removeFile = (id: string) => {
        setUploads((prev) => prev.filter((u) => u.id !== id));
    };

    // Update Name
    const updateCandidateName = (id: string, name: string) => {
        setUploads((prev) =>
            prev.map((u) =>
                u.id === id ? { ...u, candidateName: name } : u
            )
        );
    };

    // Upload Single File
    const uploadSingleFile = async (id: string) => {
        const item = uploads.find((u) => u.id === id);
        if (!item || !item.candidateName.trim()) return;

        try {
            const res = await ResumeAPI.getBatchUploadUrls(jobId, [
                {
                    fileName: item.file.name,
                    fileType: item.file.type,
                    fileSize: item.file.size,
                },
            ]);

            if (!res.success) throw new Error("Signed URL failed");

            const signed = res.data.uploads[0];

            setUploads((prev) =>
                prev.map((u) =>
                    u.id === id
                        ? { ...u, status: "uploading", progress: 50 }
                        : u
                )
            );

            const uploadRes = await fetch(signed.uploadUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": item.file.type,
                },
                body: item.file,
            });

            if (!uploadRes.ok) throw new Error("Upload failed");

            setUploads((prev) =>
                prev.map((u) =>
                    u.id === id
                        ? {
                            ...u,
                            status: "uploaded",
                            progress: 100,
                            fileKey: signed.fileKey,
                        }
                        : u
                )
            );
        } catch {
            setUploads((prev) =>
                prev.map((u) =>
                    u.id === id
                        ? { ...u, status: "failed", progress: 0 }
                        : u
                )
            );
        }
    };

    // Final Submit
    const finalizeUploads = async () => {
        try {
            setFinalLoading(true);

            const payload = uploads.map((u) => ({
                fileKey: u.fileKey!,
                candidateName: u.candidateName,
            }));

            const res = await ResumeAPI.finalizeBatchMetadata(payload);

            if (!res.success) throw new Error("Metadata failed");

            setUploads((prev) =>
                prev.map((u) => ({ ...u, status: "completed" }))
            );
        } finally {
            setFinalLoading(false);
        }
    };

    const allUploaded =
        uploads.length > 0 &&
        uploads.every((u) => u.status === "uploaded");

    return {
        uploads,
        finalLoading,
        allUploaded,
        handleFilesSelected,
        updateCandidateName,
        uploadSingleFile,
        finalizeUploads,
        removeFile,
    };
}