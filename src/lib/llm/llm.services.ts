import { AnalysisResult } from '@/types/analysis-result';
import Groq from 'groq-sdk';

export class LLMService {
    private llm: Groq;
    private model: string;

    constructor() {
        if (!process.env.GROQ_API_KEY) {
            throw new Error('GROQ_API_KEY is not set in environment variables');
        }

        this.llm = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        // Using Mixtral (great for complex analysis)
        // Alternative models: "llama2-70b-4096", "gemma-7b-it"
        this.model = "openai/gpt-oss-120b"
    }

    async analyzeResume(resumeText: string, jobDescription: string): Promise<AnalysisResult> {
        const prompt = this.buildAnalysisPrompt(resumeText, jobDescription);

        try {
            console.log('Sending request to Groq...');

            const completion = await this.llm.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are an expert HR recruiter and resume analyzer. You MUST respond with valid JSON only. No explanations, no markdown, no additional text. Just pure JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                model: this.model,
                temperature: 0.1, // Lower temperature for consistent JSON
                max_tokens: 4096,
                top_p: 0.9,
                stream: false
            });

            const response = completion.choices[0]?.message?.content || '';
            console.log('Raw Groq response:', response.substring(0, 200) + '...');

            return this.parseAnalysisResponse(response);
        } catch (error: any) {
            console.error('Groq analysis error:', error);
            throw new Error(`Failed to analyze resume: ${error.message}`);
        }
    }

    private buildAnalysisPrompt(resumeText: string, jdText: string): string {
        return `Analyze this resume against the job description and return a JSON object.

JOB DESCRIPTION:
${jdText}

RESUME:
${resumeText}

Return a valid JSON object with this exact structure (no other text):
{
  "candidateName": "Full name from resume",
  "email": "Email address",
  "phone": "Phone number",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": {
    "total": 5,
    "companies": ["Company1", "Company2"],
    "relevantProjects": ["Project description 1", "Project description 2"]
  },
  "education": ["Degree in CS, University Name", "Certification"],
  "softSkills": ["Communication", "Leadership", "Problem Solving"],
  "matchScore": 85,
  "strengths": ["Strong technical background", "Relevant experience"],
  "gaps": ["Missing cloud experience", "No team leadership shown"],
  "recommendations": "Brief hiring recommendation here"
}`;
    }

    private parseAnalysisResponse(response: string): AnalysisResult {
        try {
            // Clean the response - remove markdown code blocks if present
            let cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            // Find JSON object in the response (in case there's extra text)
            const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON object found in response');
            }

            const parsed = JSON.parse(jsonMatch[0]);

            // Validate and ensure all required fields exist
            return {
                candidateName: parsed.candidateName || 'Not found',
                email: parsed.email || 'Not found',
                phone: parsed.phone || 'Not found',
                skills: Array.isArray(parsed.skills) ? parsed.skills : [],
                experience: {
                    total: parsed.experience?.total || 0,
                    companies: Array.isArray(parsed.experience?.companies) ? parsed.experience.companies : [],
                    relevantProjects: Array.isArray(parsed.experience?.relevantProjects) ? parsed.experience.relevantProjects : []
                },
                education: Array.isArray(parsed.education) ? parsed.education : [],
                softSkills: Array.isArray(parsed.softSkills) ? parsed.softSkills : [],
                matchScore: typeof parsed.matchScore === 'number' ? parsed.matchScore : 0,
                strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
                gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
                recommendations: parsed.recommendations || 'No recommendations provided'
            };
        } catch (error) {
            console.error('Failed to parse Groq response:', error);
            console.error('Raw response:', response);

            // Return default structure
            return {
                candidateName: 'Error parsing',
                email: 'Error parsing',
                phone: 'Error parsing',
                skills: [],
                experience: { total: 0, companies: [], relevantProjects: [] },
                education: [],
                softSkills: [],
                matchScore: 0,
                strengths: [],
                gaps: [],
                recommendations: 'Failed to parse analysis response'
            };
        }
    }

    async testConnection(): Promise<{ success: boolean; message: string }> {
        try {
            const completion = await this.llm.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: "Respond with a simple JSON: {\"status\": \"connected\", \"model\": \"mixtral\"}"
                    }
                ],
                model: this.model,
                temperature: 0,
                max_tokens: 100
            });

            const response = completion.choices[0]?.message?.content || '';

            return {
                success: true,
                message: `Connected successfully! Response: ${response.substring(0, 100)}`
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Connection failed: ${error.message}`
            };
        }
    }
}