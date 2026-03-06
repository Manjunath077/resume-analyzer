'use client';

import { LogIn, LogOut } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const GoogleSignInButton = () => {
    const { data: session, status } = useSession();
    const router = useRouter();


    return (
        <div className="flex items-center ">
            {status === "authenticated" && session?.user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="focus:outline-none">
                            {session.user.image && (
                                <Image
                                    src={session.user.image}
                                    alt={session.user.name || 'Profile'}
                                    width={40}
                                    height={40}
                                    className="rounded-full ring-2 ring-gray-200 hover:ring-gray-300 transition cursor-pointer"
                                />
                            )}
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-64">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {session.user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={async () => {
                                await signOut({ redirect: false });
                                router.replace("/");
                            }}
                            className="text-red-600 cursor-pointer"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                // Sign in button remains the same
                <button
                    onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                    className="flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition font-medium text-gray-700 cursor-pointer"
                >
                    <LogIn size={18} />
                    Sign In
                </button>
            )}
        </div>
    );
};

export default GoogleSignInButton;