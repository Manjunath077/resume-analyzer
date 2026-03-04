import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY as string),
});

export const bucket = storage.bucket(
  process.env.GCP_BUCKET_NAME as string
);