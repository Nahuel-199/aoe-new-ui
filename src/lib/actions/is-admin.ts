"use server";

import { auth } from "@/auth";

export async function isAdminAction() {
  const session = await auth();

  const isAdmin =
    session?.user?.email === process.env.USER_ADMIN_EMAIL ||
    session?.user?.email === process.env.USER_ADMIN_EMAIL2 ||
    session?.user?.email === process.env.USER_ADMIN_EMAIL3;

  return { isAdmin };
}
