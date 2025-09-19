"use server";

import { connectDB } from "../db";
import { User } from "@/models/user.model";

export async function findOrCreateUser(userData: {
    name?: string;
    email: string;
    image?: string;
}) {
    await connectDB();

    let user = await User.findOne({ email: userData.email });

    if (!user) {
        user = await User.create({
            name: userData.name || "Sin nombre",
            email: userData.email,
            image: userData.image,
            role: "user",
        });
    }

    return user;
}