import Image from "next/image";
import SignIn from "./auth/SignIn";

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center px-6 py-2 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">

            {/* Logo */}
            <Image
                src={'/logo.png'}
                alt={'Logo'}
                width={100}
                height={100}
            />
            {/* Auth Section */}
            <SignIn />
        </nav>
    );
};

export default Navbar;