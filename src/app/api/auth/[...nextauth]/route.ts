import NextAuth, { NextAuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt"
import GitHubProvider from "next-auth/providers/github"
import { Account, Profile, Session, User } from "next-auth"

export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }: { token: JWT, account: Account | null, profile?: Profile})
        {
            if (account && account.access_token) {
                token.accessToken = account.access_token;
            }

            if (profile && (profile as any).id) {
                token.id = (profile as any).id as string;
            }

            return token;
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            session.accessToken = token.accessToken;
            session.user.id = token.id as string;
            
            return session;
        }
    }
}

export const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
