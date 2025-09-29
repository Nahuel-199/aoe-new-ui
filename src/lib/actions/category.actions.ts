"use server";

import { connectDB } from "../db";
import { CategoryModel } from "@/models/category.model";

export async function createCategory(data: { name: string; }) {
    await connectDB();
    const category = await CategoryModel.create({
        name: data.name,
    });
    return JSON.parse(JSON.stringify(category));
}

export async function getCategories() {
    await connectDB();
    const categories = await CategoryModel.find().lean();
    return JSON.parse(JSON.stringify(categories));
}

export async function deleteCategory(id: string) {
    await connectDB();
    await CategoryModel.findByIdAndDelete(id);
    return { success: true };
}

export async function updateCategory(
    id: string,
    data: { name?: string; }
) {
    await connectDB();
    const updated = await CategoryModel.findByIdAndUpdate(id, data, {
        new: true,
    }).lean();
    return JSON.parse(JSON.stringify(updated));
}
