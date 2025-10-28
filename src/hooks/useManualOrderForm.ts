"use client";

import { imageUpload } from "@/utils/uploadCloudinary";
import { showToast } from "nextjs-toast-notify";
import { useState } from "react";


export const useManualOrderForm = () => {
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [items, setItems] = useState([
    {
      name: "",
      description: "",
      images: [] as { id: string; url: string }[],
      color: "",
      size: "",
      price: 0,
      quantity: 1,
    },
  ]);

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        name: "",
        description: "",
        images: [],
        color: "",
        size: "",
        price: 0,
        quantity: 1,
      },
    ]);
  };

  const handleUploadImage = async (index: number, files: File[]) => {
    if (files.length === 0) return;
    try {
      setIsUploadingImage(true);
      const uploaded = await imageUpload(files);

    const formatted: Array<{ id: string; url: string }> = uploaded.map((img: { public_id: string; url: string }) => ({
      id: img.public_id,
      url: img.url,
    }));

      const updated = [...items];
      updated[index].images = [...updated[index].images, ...formatted];
      setItems(updated);

      showToast.success("Imágenes cargadas correctamente");
    } catch (err) {
      showToast.error("Error al subir imágenes");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = (itemIndex: number, imgIndex: number) => {
    const updated = [...items];
    updated[itemIndex].images.splice(imgIndex, 1);
    setItems(updated);
  };

  return {
    items,
    setItems,
    isUploadingImage,
    addItem,
    handleChange,
    handleUploadImage,
    handleRemoveImage,
  };
};
