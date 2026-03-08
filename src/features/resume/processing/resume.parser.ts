// Purpose: Extracts text from resume.
import { PDFParse } from 'pdf-parse';
import mammoth from "mammoth";

export async function parseResume(
    buffer: Buffer,
    fileName: string
): Promise<string> {

    const lower = fileName.toLowerCase();

    if (lower.endsWith(".pdf")) {

         const uint8 = new Uint8Array(buffer);

        const parser = new PDFParse(uint8);
        const result = await parser.getText();
        return result.text;
    }

    if (lower.endsWith(".docx")) {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    }

    if (lower.endsWith(".doc")) {
        throw new Error("DOC format not supported yet");
    }

    throw new Error("Unsupported resume format");
}