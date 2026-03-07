import { NextRequest, NextResponse } from "next/server";
import { bucket } from "@/lib/gcp/storage";
import { v4 as uuidv4 } from "uuid";
import { getToken } from "next-auth/jwt";
import clientPromise from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 10;


// POST /api/resumes/upload-url

// {
//   "jobId": "abc123",
//   "files": [
//     {
//       "fileName": "resume1.pdf",
//       "fileType": "application/pdf",
//       "fileSize": 400000
//     },
//     {
//       "fileName": "resume2.pdf",
//       "fileType": "application/pdf",
//       "fileSize": 300000
//     }
//   ]
// }


export async function POST(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sub) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = token.sub;
    const { jobId, files } = await req.json();

    if (!jobId || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, message: "Maximum 10 files allowed per upload" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    if (!ObjectId.isValid(jobId)) {
      return NextResponse.json(
        { success: false, message: "Invalid job ID format" },
        { status: 400 }
      );
    }

    const job = await db.collection("jobDescriptions").findOne({
      _id: new ObjectId(jobId),
      userId,
    });

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found or unauthorized" },
        { status: 404 }
      );
    }

    const uploads = [];

    for (const file of files) {
      const { fileName, fileType, fileSize } = file;

      if (!fileName || !fileType || !fileSize) continue;

      if (!ALLOWED_TYPES.includes(fileType)) continue;
      if (fileSize > MAX_FILE_SIZE) continue;

      const uniqueId = uuidv4();
      const sanitizedFileName = fileName
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.-]/g, "");

      const timestamp = Date.now();
      const fileKey = `u_${userId}/j_${jobId}/${timestamp}-${uniqueId}-${sanitizedFileName}`;

      const [uploadUrl] = await bucket.file(fileKey).getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 10 * 60 * 1000,
        contentType: fileType,
      });

      await db.collection("resumes").insertOne({
        fileKey,
        fileName: sanitizedFileName,
        jobId,
        userId,
        status: "pending",
        analysisStatus: "not_started",
        fileSize,
        fileType,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });

      uploads.push({
        fileKey,
        uploadUrl,
        expiresIn: 600,
      });
    }

    return NextResponse.json({
      success: true,
      data: { uploads },
    });
  } catch (error) {
    console.error("Batch Signed URL error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate signed URLs" },
      { status: 500 }
    );
  }
}