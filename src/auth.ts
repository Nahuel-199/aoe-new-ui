export const runtime = "nodejs";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  basePath: "/api/auth",
  session: { strategy: "jwt" },

  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      const client = await clientPromise;
      const usersCol = client.db("test").collection("users");

      if (user) {
        const adminEmails = [
          process.env.USER_ADMIN_EMAIL,
          process.env.USER_ADMIN_EMAIL2,
          process.env.USER_ADMIN_EMAIL3,
        ].filter(Boolean) as string[];

        const isAdmin =
          typeof user.email === "string" && adminEmails.includes(user.email);

        token.role = isAdmin ? "admin" : "user";

        await usersCol.updateOne(
          { email: user.email },
          { $set: { role: token.role } },
          { upsert: true }
        );

        const dbUser = await usersCol.findOne({ email: user.email });

        if (dbUser) {
          token.userId = dbUser._id.toString();
        }

        return token;
      }

      if (!token.userId && token.email) {
        const dbUser = await usersCol.findOne({ email: token.email });
        if (dbUser) {
          token.userId = dbUser._id.toString();
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.role = (token.role as string) || "user";
      session.user.id = token.userId as string;
      return session;
    },
  },
});
