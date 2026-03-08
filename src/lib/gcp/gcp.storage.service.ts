import { Storage } from "@google-cloud/storage";

const credentials = JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY!);

export const storage = new Storage({
    credentials,
    projectId: credentials.project_id,
});

const bucketName = process.env.GCP_BUCKET_NAME!;

export async function getSignedUrl(fileKey: string) {
    const [url] = await storage
        .bucket(bucketName)
        .file(fileKey)
        .getSignedUrl({
            action: "read",
            expires: Date.now() + 15 * 60 * 1000,
        });

    return url;
}