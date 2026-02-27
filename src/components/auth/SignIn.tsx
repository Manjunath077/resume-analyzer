'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { LogOut, LogIn, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SignIn = () => {
    const { data: session, status } = useSession();
    const router = useRouter();


    return (
        <div className="flex items-center">
            {status === "authenticated" && session?.user ? (
                <div className="flex items-center gap-4 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition">

                    {session.user.image && (
                        <Image
                            src={session.user.image}
                            alt={session.user.name || 'Profile'}
                            width={36}
                            height={36}
                            className="rounded-full ring-2 ring-gray-200"
                        />
                    )}

                    <div className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold text-gray-800">
                            {session.user.name}
                        </span>
                        <span className="text-xs text-gray-500">
                            {session.user.email}
                        </span>
                    </div>

                    <button
                        onClick={async () => {
                            await signOut({ redirect: false });
                            router.replace("/");
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                    className="flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition font-medium text-gray-700"
                >
                    <LogIn size={18} />
                    Sign in with Google
                </button>
            )}
        </div>
    );
};

export default SignIn;