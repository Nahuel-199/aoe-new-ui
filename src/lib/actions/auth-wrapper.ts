"use server";

import { auth } from "@/auth";
import { connectDB } from "../db";
import { User } from "@/models/user.model";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

interface UserLean {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  if (!session?.user?.email) return null;

  await connectDB();

  const user = await User.findOne({ email: session.user.email }).lean<UserLean>().exec();

  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  };
}

export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id || null;
}
