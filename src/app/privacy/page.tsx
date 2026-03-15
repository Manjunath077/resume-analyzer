export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-20">
                <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

                <p className="mb-4">
                    This Privacy Policy describes how Resume Analyzer collects, uses,
                    and protects your information when you use our application.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">Information We Collect</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Your Google account email and basic profile information for authentication.</li>
                    <li>Resumes that you upload for analysis.</li>
                    <li>Basic usage data to improve the service.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-3">How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>To provide AI-powered resume analysis.</li>
                    <li>To authenticate and manage user accounts.</li>
                    <li>To improve our application and user experience.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-3">Data Security</h2>
                <p>
                    We take reasonable measures to protect your information. Uploaded resumes
                    are processed securely and are not shared with third parties.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">Third-Party Services</h2>
                <p>
                    Our application may use third-party services such as authentication
                    providers and AI processing services to operate the platform.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. Updates will be
                    posted on this page.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">Contact</h2>
                <p>
                    If you have questions about this Privacy Policy, please contact us at <br/> <strong>support@resume-analyzer.com</strong>.
                </p>
            </div>
        </div>
    );
}