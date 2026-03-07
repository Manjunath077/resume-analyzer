// Purpose: Downloads resume from storage. GCS

export async function downloadResume(fileUrl: string): Promise<Buffer> {
  const response = await fetch(fileUrl);

  if (!response.ok) {
    throw new Error("Failed to download resume");
  }

  const arrayBuffer = await response.arrayBuffer();

  return Buffer.from(arrayBuffer);
}