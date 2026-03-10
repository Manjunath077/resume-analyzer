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
        <div className="flex items-center">

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
                                    className="rounded-full ring-2 ring-gray-200 hover:ring-gray-400 transition-all cursor-pointer"
                                />
                            )}
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-64 bg-white border border-gray-200 shadow-lg rounded-xl p-2"
                    >

                        <DropdownMenuLabel className="p-3">
                            <div className="flex flex-col space-y-1">
                                <p
                                    className="text-sm font-semibold"
                                    style={{ color: 'var(--foreground)' }}
                                >
                                    {session.user.name}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {session.user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator className="bg-gray-200" />

                        <DropdownMenuItem
                            onClick={async () => {
                                await signOut({ redirect: false });
                                router.replace("/");
                            }}
                            className="cursor-pointer rounded-lg transition-colors p-3 text-sm font-medium hover:bg-gray-100"
                            style={{ color: 'var(--foreground)' }}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign Out</span>
                        </DropdownMenuItem>

                    </DropdownMenuContent>

                </DropdownMenu>
            ) : (

                <button
                    onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                    className="flex items-center gap-3 px-6 py-2.5 text-white rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                    style={{ background: 'var(--foreground)' }}
                >
                    <LogIn size={18} />
                    Sign In with Google
                </button>

            )}

        </div>
    );
};

export default GoogleSignInButton;