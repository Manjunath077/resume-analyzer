'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.replace('/dashboard');
        }
    }, [status, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
            <h1 className="text-4xl font-bold mb-4">
                AI Powered Resume Analyzer
            </h1>
            <p className="text-gray-600 mb-8">
                Upload your resume and get instant AI feedback, ATS score, and improvement suggestions.
            </p>
        </div>
    );
}