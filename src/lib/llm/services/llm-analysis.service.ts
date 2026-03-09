// This is the main service your processor will call.

import { buildResumeAnalysisPrompt } from "../prompts/resume-analysis.prompt";
import { callGroq } from "../groq/groq.client";
import { LLMAnalysisResult } from "../types/llm.types";

export class LLMAnalysisService {

    async analyzeResume(
        resumeText: string,
        jobDescription: string
    ): Promise<LLMAnalysisResult> {

        const prompt = buildResumeAnalysisPrompt(
            resumeText,
            jobDescription
        );

        const response = await callGroq(prompt);

        return this.parseResponse(response);
    }

    private parseResponse(response: string): LLMAnalysisResult {

        try {

            let cleaned = response
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

            if (!jsonMatch) {
                throw new Error("Invalid JSON");
            }

            const parsed = JSON.parse(jsonMatch[0]);

            return parsed;

        } catch (error) {

            console.error("LLM parse error:", error);

            return {
                candidateName: "Unknown",
                email: "",
                phone: "",
                skills: [],
                experience: { total: 0, companies: [], relevantProjects: [] },
                education: [],
                softSkills: [],
                matchScore: 0,
                strengths: [],
                gaps: [],
                recommendations: "Failed to analyze"
            };
        }
    }
}