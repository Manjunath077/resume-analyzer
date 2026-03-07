// Purpose: Extracts text from resume.
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function parseResume(
    buffer: Buffer,
    fileUrl: string
): Promise<string> {

    if (fileUrl.endsWith(".pdf")) {
        const data = await pdfParse(buffer);
        return data.text;
    }

    if (fileUrl.endsWith(".docx")) {
        const result = await mammoth.extractRawText({
            buffer,
        });

        return result.value;
    }

    throw new Error("Unsupported resume format");
}