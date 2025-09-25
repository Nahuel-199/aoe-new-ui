import { useState } from "react";
import { imageUpload } from "@/utils/uploadCloudinary";
import { updateProduct } from "@/lib/actions/product.actions";
import { Product } from "@/types/product.types";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

export const useEditProductForm = (product: Product) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        _id: product._id,
        name: product.name || "",
        description: product.description || "",
        price: product.price.toString() || "",
        is_offer: product.is_offer || false,
        price_offer: product.price_offer?.toString() || "",
        category: product.category ? [product.category._id] : [],
        subcategories: product.subcategories
            ? product.subcategories.map((s) => s._id)
            : [],
        type: product.type || "",
        variants: product.variants || [],
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleCategory = (value: string[]) =>
        setForm({ ...form, category: value, type: "" });

    const handleSubcategories = (value: string[]) =>
        setForm({ ...form, subcategories: value });

    const handleType = (value: string[]) =>
        setForm({ ...form, type: value[0] });

    const handlePriceChange = (value: string) => {
        setForm((prev) => ({ ...prev, price: value }));
    };

    const handleOfferChange = (value: boolean) => {
        setForm({ ...form, is_offer: value });
    };

    const addVariant = () => {
        setForm({
            ...form,
            variants: [
                ...form.variants,
                { color: "", images: [], sizes: [{ size: "S", stock: 0 }] },
            ],
        });
    };

    const updateVariant = (index: number, field: string, value: any) => {
        const newVariants = [...form.variants];
        (newVariants[index] as any)[field] = value;
        setForm({ ...form, variants: newVariants });
    };

    const addSizeToVariant = (index: number) => {
        const newVariants = [...form.variants];
        newVariants[index].sizes.push({ size: "M", stock: 0 });
        setForm({ ...form, variants: newVariants });
    };

    const handleUploadImage = async (index: number, files: File[]) => {
        if (files.length === 0) return;

        const uploaded = await imageUpload(files);
        const formattedImages = uploaded.map((img) => ({
            id: img.public_id,
            url: img.url,
        }));

        const newVariants = [...form.variants];
        newVariants[index].images = [
            ...newVariants[index].images,
            ...formattedImages,
        ];
        setForm({ ...form, variants: newVariants });
    };

    const handleRemoveImage = (variantIndex: number, imgIndex: number) => {
        const newVariants = [...form.variants];
        newVariants[variantIndex].images.splice(imgIndex, 1);
        setForm({ ...form, variants: newVariants });
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            await updateProduct(form._id, {
                name: form.name,
                description: form.description,
                price: Number(form.price),
                is_offer: form.is_offer,
                price_offer: form.price_offer ? Number(form.price_offer) : undefined,
                category: form.category[0],
                subcategories: form.subcategories,
                type: form.type,
                variants: form.variants,
            });
            toaster.success({
                title: "Producto actualizado",
                duration: 3000,
            });
            router.push("/admin/products");
        } catch (err) {
            toaster.error({
                title: "Error al actualizar el producto",
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }

    };

    return {
        form,
        setForm,
        handleChange,
        handleCategory,
        handleSubcategories,
        handleType,
        handlePriceChange,
        handleOfferChange,
        addVariant,
        updateVariant,
        addSizeToVariant,
        handleUploadImage,
        handleRemoveImage,
        handleSubmit,
        isLoading,
    };
};
