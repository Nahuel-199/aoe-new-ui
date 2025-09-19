"use server";

import { connectDB } from "../db";
import { SubcategoryModel } from "@/models/subcategory.model";

export async function createSubcategory(data: { name: string }) {
    await connectDB();
    const subcategory = await SubcategoryModel.create({ name: data.name });
    return JSON.parse(JSON.stringify(subcategory));
}

export async function getSubcategories() {
    await connectDB();
    const subcategories = await SubcategoryModel.find().lean();
    return JSON.parse(JSON.stringify(subcategories));
}

export async function deleteSubcategory(id: string) {
    await connectDB();
    await SubcategoryModel.findByIdAndDelete(id);
    return { success: true };
}

export async function updateSubcategory(id: string, data: { name?: string }) {
    await connectDB();
    const updated = await SubcategoryModel.findByIdAndUpdate(id, data, {
        new: true,
    }).lean();
    return JSON.parse(JSON.stringify(updated));
}