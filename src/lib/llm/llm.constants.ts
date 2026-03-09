export const LLM_MODEL = "openai/gpt-oss-120b";

export const TROUBLESHOOTING_STEPS = [
    'Check if GROQ_API_KEY is set in .env.local',
    'Verify API key is correct (starts with gsk_)',
    'Check your internet connection',
    'Visit https://console.groq.com to verify your account'
];

export const LLM_TEMPERATURE = 0.1;

export const LLM_MAX_TOKENS = 4096;

export const SYSTEM_PROMPT = `
You are an expert HR recruiter and resume analyzer.

You MUST return valid JSON only.

Do not return markdown.
Do not return explanations.
Return ONLY JSON.
`;