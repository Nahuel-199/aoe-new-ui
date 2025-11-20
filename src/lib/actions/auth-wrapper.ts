"use server";

import { auth } from "@/auth";
import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
  }
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  if (!session?.user?.email) return null;
  if (!session.user.id) return null;

  return {
    id: session.user.id,
    name: session.user.name!,
    email: session.user.email!,
    image: session.user.image || undefined,
    role: session.user.role || "user",
  };
}

export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id || null;
}