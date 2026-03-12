// Purpose: buildResumeAnalysisPrompt()
// Input: resumeText, jobDescription
// Output: LLM prompt

export function buildResumeAnalysisPrompt(
  resumeText: string,
  jobDescription: string
): string {

  return `
You are an expert technical recruiter.

Analyze the candidate resume against the job description and evaluate how well the candidate fits the role.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Your task:

1. Extract candidate details.
2. Compare resume skills with job requirements.
3. Evaluate experience relevance.
4. Predict how strong the candidate is for this role.
5. Identify strengths and missing skills.

Return STRICT JSON in the following format:

{
  "candidateName": "",
  "email": "",
  "phone": "",

  "skills": [],
  "matchedSkills": [],
  "missingCriticalSkills": [],

  "experience": {
    "total": 0,
    "companies": [],
    "relevantProjects": []
  },

  "education": [],
  "softSkills": [],

  "careerLevel": "",
  "roleFit": "",

  "skillMatchScore": 0,
  "experienceMatchScore": 0,
  "educationMatchScore": 0,
  "overallFitScore": 0,

  "interviewProbability": 0,

  "strengths": [],
  "gaps": [],
  "riskFlags": [],

  "recommendations": ""
}

Rules:
- All scores must be between 0 and 100.
- interviewProbability must be between 0 and 1.
- Return valid JSON only.
- Do not include explanations outside JSON.
`;
}