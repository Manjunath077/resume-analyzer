'use client';

import GoogleSignInButton from "@/features/auth/ui/components/GoogleSignInButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {

    const pathname = usePathname();
    const isHomePage = pathname === "/";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--foreground)' }}
                >
                    <span className="text-white font-bold text-lg">R</span>
                </div>

                <span
                    className="font-bold text-xl hidden sm:block"
                    style={{ color: 'var(--foreground)' }}
                >
                    Resume Analyzer
                </span>
            </Link>

            {/* Navigation Links (ONLY on landing page) */}
            {isHomePage && (
                <div className="hidden md:flex gap-8">
                    <a
                        href="#features"
                        className="text-sm text-gray-500 hover:opacity-80 transition-colors tracking-wide"
                        style={{ color: 'var(--foreground)' }}
                    >
                        Features
                    </a>

                    <a
                        href="#how-it-works"
                        className="text-sm text-gray-500 hover:opacity-80 transition-colors tracking-wide"
                        style={{ color: 'var(--foreground)' }}
                    >
                        How it works
                    </a>
                </div>
            )}

            {/* Auth Section */}
            <GoogleSignInButton />

        </nav>
    );
};

export default Navbar;