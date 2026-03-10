import {
    ShieldCheck,
    FileText,
    UploadCloud,
    Workflow,
    Database,
    Brain,
} from "lucide-react";

export const landingFeatures = [
    {
        icon: ShieldCheck,
        title: "Secure Google Authentication",
        desc: "Sign in instantly using Google. No passwords to manage — quick and secure access powered by NextAuth.",
        delay: "0.1s",
    },
    {
        icon: FileText,
        title: "Job Description Management",
        desc: "Create and manage multiple job descriptions so resumes can be evaluated specifically against each role.",
        delay: "0.2s",
    },
    {
        icon: UploadCloud,
        title: "Bulk Resume Upload",
        desc: "Upload multiple resumes from your local system or import them directly from Google Drive.",
        delay: "0.3s",
    },
    {
        icon: Workflow,
        title: "Queue-Based Processing",
        desc: "Resumes are processed asynchronously using BullMQ queues so large batches never block the system.",
        delay: "0.4s",
    },
    {
        icon: Database,
        title: "Redis Smart Caching",
        desc: "AI responses are cached using Redis to prevent repeated LLM calls and significantly improve performance.",
        delay: "0.5s",
    },
    {
        icon: Brain,
        title: "AI Resume Evaluation",
        desc: "Powered by Groq LLM to extract candidate skills, experience, strengths, and job-fit insights for HR teams.",
        delay: "0.6s",
    },
];

export const workFlowSteps = [
    {
        number: '01',
        title: 'Login with Google',
        desc: 'Securely sign in using your Google account and access your recruiter dashboard instantly.',
    },
    {
        number: '02',
        title: 'Create a Job Description',
        desc: 'Define the role you are hiring for. This job description becomes the reference for resume analysis.',
    },
    {
        number: '03',
        title: 'Upload Candidate Resumes',
        desc: 'Upload multiple resumes from your computer or Google Drive and attach them to the selected job description.',
    },
    {
        number: '04',
        title: 'Run AI Analysis',
        desc: 'Resumes are queued, analyzed by AI, and structured insights are generated to help recruiters evaluate candidates quickly.',
    },
];