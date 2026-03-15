export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-20">
                <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

                <p className="mb-4">
                    By using Resume Analyzer, you agree to the following terms and conditions.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">Use of the Service</h2>
                <p>
                    Resume Analyzer provides AI-generated insights for resumes. The analysis
                    is intended for informational purposes only.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">User Responsibilities</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>You must have permission to upload and analyze resumes.</li>
                    <li>You agree not to misuse or attempt to disrupt the service.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-3">AI Generated Results</h2>
                <p>
                    Resume analysis results are generated using artificial intelligence and
                    may not always be accurate. Users should use their own judgment when
                    interpreting the results.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">Limitation of Liability</h2>
                <p>
                    Resume Analyzer is not responsible for any decisions made based on the
                    analysis results.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">Changes to Terms</h2>
                <p>
                    We may update these terms from time to time. Continued use of the service
                    means you accept the updated terms.
                </p>
            </div>
        </div>
    );
}