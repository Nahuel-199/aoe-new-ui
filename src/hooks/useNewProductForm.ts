import { useState } from "react";
import { imageUpload } from "@/utils/uploadCloudinary";
import { createProduct } from "@/lib/actions/product.actions";
import { toaster } from "@/components/ui/toaster";

export const useNewProductForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        is_offer: false,
        price_offer: "",
        category: [] as string[],
        subcategories: [] as string[],
        type: "",
        variants: [] as any[],
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

        const formattedImages = uploaded.map(img => ({ id: img.public_id, url: img.url }));

        const newVariants = [...form.variants];
        newVariants[index].images = [...newVariants[index].images, ...formattedImages];
        setForm({ ...form, variants: newVariants });
    };

    const handleRemoveImage = (variantIndex: number, imgIndex: number) => {
        const newVariants = [...form.variants];
        newVariants[variantIndex].images.splice(imgIndex, 1);
        setForm({ ...form, variants: newVariants });
    };

    const handlePriceChange = (value: string) => {
        setForm((prev) => ({ ...prev, price: value }));
    };

    const handleOfferChange = (value: boolean) => {
        setForm({ ...form, is_offer: value });
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            await createProduct({
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

            setForm({
                name: "",
                description: "",
                price: "",
                is_offer: false,
                price_offer: "",
                category: [],
                subcategories: [],
                type: "",
                variants: [],
            });
            toaster.success({
                title: "Producto actualizado",
                duration: 3000,
            });
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
        isLoading
    };
};
