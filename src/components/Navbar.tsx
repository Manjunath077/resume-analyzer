import Link from "next/link";
import SignIn from "./auth/SignIn";

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center px-6 py-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">

            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-gray-800">
                ResumeAnalyzer
            </Link>

            {/* Auth Section */}
            <SignIn />
        </nav>
    );
};

export default Navbar;