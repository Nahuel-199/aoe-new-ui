"use server";

import { auth } from "@/auth";
import { findOrCreateUser } from "./user.actions";

export async function registerUserOnLogin() {
    const session = await auth();
    if (!session?.user?.email) return null;

    const user = await findOrCreateUser({
        email: session.user.email,
        name: session.user.name || '',
        image: session.user.image || '',
    });

    return user;
}

export async function getSession() {
  return await auth();
}