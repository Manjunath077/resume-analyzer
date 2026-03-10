'use client';

import Navbar from '@/components/Navbar';
import { landingFeatures, workFlowSteps } from '@/constants/landing';
import {
    FeatureCard,
    FloatingOrb,
    StatItem,
    StepCard
} from "@/features/landing";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function HomePage() {
    const { status } = useSession();
    const router = useRouter();
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (status === 'authenticated') {
            router.replace('/dashboard');
        }
    }, [status, router]);

    return (
        <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

            <Navbar />

            {/* HERO */}
            <section
                className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-16 text-center overflow-hidden"
                ref={heroRef}
            >
                <FloatingOrb
                    style={{
                        width: 500,
                        height: 500,
                        background: "rgba(0,0,0,0.02)",
                        top: "10%",
                        left: "-10%",
                    }}
                />

                <FloatingOrb
                    style={{
                        width: 400,
                        height: 400,
                        background: "rgba(0,0,0,0.02)",
                        bottom: "5%",
                        right: "-8%",
                    }}
                />

                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium tracking-wide mb-8 opacity-0 animate-fade-up"
                    style={{
                        background: "rgba(0,0,0,0.04)",
                        color: 'var(--foreground)',
                    }}
                >
                    <div
                        className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
                        style={{ background: 'var(--foreground)' }}
                    />
                    Resume Screening · Built for Recruiters
                </div>

                <h1
                    className="font-extrabold text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight mb-6 opacity-0 animate-fade-up"
                    style={{ color: 'var(--foreground)' }}
                >
                    Smarter Resume
                    <br />
                    Candidate Screening
                </h1>

                <p className="text-gray-500 text-lg max-w-2xl leading-relaxed mx-auto mb-10 opacity-0 animate-fade-up">
                    Upload multiple candidate resumes, match them against a job description,
                    and let AI analyze skills, experience, and fit. Designed for HR teams to
                    evaluate candidates faster and make better hiring decisions.
                </p>

                <div className="flex gap-4 flex-wrap justify-center opacity-0 animate-fade-up">
                    <a
                        href="#how-it-works"
                        className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-sm transition-all hover:-translate-y-1"
                    >
                        See how it works
                    </a>
                </div>
            </section>

            {/* STATS */}
            <div className="border-y border-gray-200">
                <div className="flex justify-center flex-wrap max-w-4xl mx-auto">
                    <StatItem value="Multi" label="Job Descriptions Supported" />
                    <StatItem value="Async" label="Queue Processing" />
                    <StatItem value="AI" label="Powered Analysis" />
                </div>
            </div>

            {/* FEATURES */}
            <section className="py-24 px-6" id="features">

                <div className="max-w-5xl mx-auto">

                    <span
                        className="text-xs font-semibold tracking-wider uppercase mb-4 block"
                        style={{ color: 'var(--foreground)' }}
                    >
                        Platform Features
                    </span>

                    <h2
                        className="font-bold text-3xl md:text-4xl lg:text-5xl max-w-2xl mb-4"
                        style={{ color: 'var(--foreground)' }}
                    >
                        Everything recruiters need to evaluate resumes faster
                    </h2>

                    <p className="text-gray-500 max-w-xl mb-16 leading-relaxed">
                        Resume Analyzer helps HR teams manage job descriptions,
                        upload candidate resumes, and run AI-powered analysis to
                        extract meaningful insights for hiring decisions.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {landingFeatures.map((f) => (
                            <FeatureCard key={f.title} {...f} />
                        ))}
                    </div>
                </div>
            </section>

            {/* WORKFLOW */}
            <section className="py-24 px-6 bg-gray-50 border-y border-gray-200" id="how-it-works">

                <div className="max-w-5xl mx-auto">

                    <span
                        className="text-xs font-semibold tracking-wider uppercase mb-4 block"
                        style={{ color: 'var(--foreground)' }}
                    >
                        Workflow
                    </span>

                    <h2
                        className="font-bold text-3xl md:text-4xl lg:text-5xl max-w-2xl mb-4"
                        style={{ color: 'var(--foreground)' }}
                    >
                        From job description to candidate insights
                    </h2>

                    <p className="text-gray-500 max-w-xl mb-16 leading-relaxed">
                        A streamlined workflow designed to help recruiters analyze
                        multiple resumes against a specific role with the help of AI.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <div className="space-y-0">
                            {workFlowSteps.map((s) => (
                                <StepCard key={s.number} {...s} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-gray-200 py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-4">

                <div className="flex items-center gap-2 font-extrabold text-xl">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: 'var(--foreground)' }}
                    />
                    <span style={{ color: 'var(--foreground)' }}>Resume Analyzer</span>
                </div>

                <p className="text-xs text-gray-500">
                    © {new Date().getFullYear()} Resume Analyzer
                </p>
            </footer>

        </div>
    );
}