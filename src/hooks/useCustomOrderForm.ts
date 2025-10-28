import { createCustomOrder } from "@/lib/actions/customOrder.action";
import { deleteImage } from "@/utils/deleteCloudinary";
import { imageUpload } from "@/utils/uploadCloudinary";
import { useState } from "react";

export const useCustomOrderForm = () => {
    const [form, setForm] = useState({
        clientName: "",
        phoneNumber: "",
        email: "",
        items: [] as {
            name: string;
            description?: string;
            color?: string;
            size?: string;
            quantity: number;
            price: number;
            images: { id: string; url: string }[];
        }[],
        designReferences: [] as { id: string; url: string }[],
        deliveryMethod: "",
        shippingAddress: "",
        meetingAddress: "",
        total: 0,
        remainingAmount: 0,
        paidAmount: 0,
        deliveryCost: 0,
        status: "pending",
        paymentStatus: "pending",
        comments: "",
        designNotes: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const updateField = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const addItem = (item?: Partial<(typeof form.items)[number]>) => {
        setForm((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    name: "",
                    description: "",
                    color: "",
                    size: "",
                    quantity: 1,
                    price: 0,
                    images: [],
                    ...item,
                },
            ],
        }));
    };

    const removeItem = (index: number) => {
        setForm((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const handleUploadItemImages = async (index: number, files: File[]) => {
        try {
            setIsUploading(true);
            const uploaded = await imageUpload(files);
            setForm((prev) => {
                const items = [...prev.items];
                items[index].images = [
                    ...items[index].images,
                    ...uploaded.map((img) => ({ id: img.public_id, url: img.url })),
                ];
                return { ...prev, items };
            });
        } catch (error) {
            console.error("Error al subir imágenes:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadDesignRefs = async (files: File[]) => {
        try {
            setIsUploading(true);
            const uploaded = await imageUpload(files);
            setForm((prev) => ({
                ...prev,
                designReferences: [
                    ...prev.designReferences,
                    ...uploaded.map((img) => ({ id: img.public_id, url: img.url })),
                ],
            }));
        } catch (error) {
            console.error("Error al subir referencias:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const order = await createCustomOrder(form);
            return order;
        } catch (error) {
            console.error("Error al crear la orden personalizada:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        form,
        isLoading,
        isUploading,
        updateField,
        addItem,
        removeItem,
        handleUploadItemImages,
        handleUploadDesignRefs,
        handleSubmit,
        setForm,
    };
}
