import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';

// Type definition for session (you can expand this)
declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            image?: string;
            accessToken?: string;
        }
    }
}

// Create the NextAuth handler
const handler = NextAuth({
    // Use MongoDB adapter to store users in database
    adapter: MongoDBAdapter(clientPromise, {
        databaseName: 'resume-analyzer',
        collections: {
            Users: 'users',
            Accounts: 'accounts',
            Sessions: 'sessions',
            VerificationTokens: 'verification_tokens',
        }
    }),

    // Configure providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            // Request additional permissions for Google Drive
            authorization: {
                params: {
                    scope: 'openid email profile https://www.googleapis.com/auth/drive.readonly',
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code'
                }
            }
        })
    ],

    // Custom pages (optional - you can create these later)
    pages: {
        signIn: '/auth/signin',     // Custom sign-in page
        signOut: '/auth/signout',   // Custom sign-out page
        error: '/auth/error',       // Error page
        verifyRequest: '/auth/verify', // Email verification
    },

    // Callbacks to customize what's stored in session/JWT
    callbacks: {
        // Called when creating JWT token
        async jwt({ token, account, user }) {
            // Persist the OAuth access token and user info to the token
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.userId = user?.id;
            }
            return token;
        },

        // Called when creating session
        async session({ session, token, user }) {
            // Send properties to the client
            if (session.user) {
                session.user.id = token.userId as string;
                session.user.accessToken = token.accessToken as string;
            }
            return session;
        },

        // Optional: Redirect after sign in
        async redirect({ url, baseUrl }) {
            // Redirect to dashboard after sign in
            if (url.startsWith(baseUrl)) return url;
            return baseUrl + '/dashboard';
        }
    },

    // Session configuration
    session: {
        strategy: 'jwt',            // Use JWT for sessions
        maxAge: 30 * 24 * 60 * 60,  // 30 days
    },

    // Enable debug messages in development
    debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };