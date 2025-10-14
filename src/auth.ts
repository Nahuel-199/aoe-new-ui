import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  secret: process.env.AUTH_SECRET,
  trustHost: !!process.env.NEXTAUTH_TRUST_HOST,
  basePath: "/api/auth",
});