import Groq from "groq-sdk";
import { AnalysisResult } from "../domain/analysis-result.types";

export class AnalysisService {

    private llm: Groq;
    private model = "openai/gpt-oss-120b";

    constructor() {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY not configured");
        }

        this.llm = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });
    }

    async analyzeResume(
        resumeText: string,
        jobDescription: string
    ): Promise<AnalysisResult> {

        const prompt = this.buildPrompt(resumeText, jobDescription);

        const completion = await this.llm.chat.completions.create({
            model: this.model,
            temperature: 0.1,
            max_tokens: 4096,
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert HR recruiter. Respond ONLY with valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        const response = completion.choices[0]?.message?.content ?? "";

        return JSON.parse(response);
    }

    private buildPrompt(resume: string, jd: string) {
        return `
Analyze the resume against the job description.

JOB DESCRIPTION:
${jd}

RESUME:
${resume}

Return JSON:

{
  "candidateName": "",
  "email": "",
  "phone": "",
  "skills": [],
  "experience": {
    "total": 0,
    "companies": [],
    "relevantProjects": []
  },
  "education": [],
  "softSkills": [],
  "matchScore": 0,
  "strengths": [],
  "gaps": [],
  "recommendations": ""
}
`;
    }
}