import { Storage } from "@google-cloud/storage";

let storageInstance: Storage | null = null;

function getStorage(): Storage {
  if (!storageInstance) {
    let credentials;

    if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
      try {
        credentials = JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY);
      } catch (err) {
        console.error("Invalid GCP_SERVICE_ACCOUNT_KEY JSON");
        throw err;
      }
    }

    storageInstance = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials,
    });
  }

  return storageInstance;
}

export function getBucket() {
  const storage = getStorage();

  if (!process.env.GCP_BUCKET_NAME) {
    throw new Error("GCP_BUCKET_NAME is not defined");
  }

  return storage.bucket(process.env.GCP_BUCKET_NAME);
}