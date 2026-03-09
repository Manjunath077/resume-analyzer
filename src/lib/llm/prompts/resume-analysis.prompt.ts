// Purpose: buildResumeAnalysisPrompt()
// Input: resumeText, jobDescription
// Output: LLM prompt


export function buildResumeAnalysisPrompt(
    resumeText: string,
    jobDescription: string
): string {

    return `Analyze this resume against the job description.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Return JSON with this structure:

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
}`;
}