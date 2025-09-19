"use server";

import { connectDB } from "../db";
import { ProductModel } from "@/models/product.model";
import { deleteImage } from "@/utils/deleteCloudinary";
import mongoose from "mongoose";

interface ImageInput {
    id: string;
    url: string;
}

interface VariantInput {
    color: string;
    images: ImageInput[];
    sizes: { size: string; stock: number }[];
}


export async function createProduct(data: {
    name: string;
    description?: string;
    price: number;
    is_offer: boolean;
    price_offer?: number;
    category: string;
    subcategories?: string[];
    type: string;
    variants: VariantInput[];
}) {
    await connectDB();

    const product = await ProductModel.create({
        ...data,
        category: new mongoose.Types.ObjectId(data.category),
        subcategories: data.subcategories?.map(
            (id) => new mongoose.Types.ObjectId(id)
        ),
    });

    return JSON.parse(JSON.stringify(product));
}

export async function getProducts() {
    await connectDB();
    const products = await ProductModel.find()
        .populate("category")
        .populate("subcategories")
        .lean();
    return JSON.parse(JSON.stringify(products));
}

export async function getProductById(id: string) {
    await connectDB();
    const product = await ProductModel.findById(id)
        .populate("category")
        .populate("subcategories")
        .lean();
    return JSON.parse(JSON.stringify(product));
}

export async function updateProduct(
    id: string,
    data: {
        name?: string;
        description?: string;
        price?: number;
        is_offer: boolean;
        price_offer?: number;
        category?: string;
        subcategories?: string[];
        type?: string;
        variants?: VariantInput[];
    }
) {
    await connectDB();

    const updateData = { ...data } as any;

    if (data.category) {
        updateData.category = new mongoose.Types.ObjectId(data.category);
    }

    if (data.subcategories) {
        updateData.subcategories = data.subcategories.map(
            (id) => new mongoose.Types.ObjectId(id)
        );
    }

    const updated = await ProductModel.findByIdAndUpdate(id, updateData, {
        new: true,
    })
        .populate("category")
        .populate("subcategories")
        .lean();

    return JSON.parse(JSON.stringify(updated));
}

export async function deleteProduct(id: string) {
    await connectDB();

    const product = await ProductModel.findById(id);

    if (!product) {
        throw new Error("Producto no encontrado");
    }

    for (const variant of product.variants) {
        for (const image of variant.images) {
            if (image.id) {
                await deleteImage(image.id);
            }
        }
    }

    await ProductModel.findByIdAndDelete(id);

    return { success: true };
}

export async function deleteProductImage(productId: string, variantIndex: number, imageId: string) {
    await connectDB();

    await deleteImage(imageId);

    const product = await ProductModel.findById(productId);
    if (!product) throw new Error("Producto no encontrado");

    product.variants[variantIndex].images = product.variants[variantIndex].images.filter(
        (img: any) => img.id !== imageId
    );

    await product.save();

    return JSON.parse(JSON.stringify(product));
}