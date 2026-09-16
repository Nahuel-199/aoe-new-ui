export const runtime = "nodejs";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise, { getDb } from "@/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { User } from "@/types/user.types";

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
      const db = await getDb();
      const usersCol = db.collection<User>("users");

      if (user?.email) {
        const email = user.email;
        const adminEmails = [
          process.env.USER_ADMIN_EMAIL,
          process.env.USER_ADMIN_EMAIL2,
          process.env.USER_ADMIN_EMAIL3,
        ].filter(Boolean) as string[];

        const isAdmin = adminEmails.includes(email);

        const role: User["role"] = isAdmin ? "admin" : "user";
        token.role = role;

        await usersCol.updateOne(
          { email },
          { $set: { role } },
          { upsert: true }
        );

        const dbUser = await usersCol.findOne({ email });

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
