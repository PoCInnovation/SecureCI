import NextAuth from "next-auth/next"
import GitHubProvider from "next-auth/providers/github"

export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
    ],
    secret: process.env.JWT_SECRET,
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account) {
                token.accessToken = account.access_token
                token.id = profile.id
            }
            return token
        },
        async session({ session, token, user }) {
            session.accessToken = token.accessToken
            session.user.id = token.id
            console.log('test', session, token, user);
            
            return session
        }
    }
}

export const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }