import { useState } from "react";
import { imageUpload } from "@/utils/uploadCloudinary";
import { updateProduct } from "@/lib/actions/product.actions";
import { Product } from "@/types/product.types";
import { useRouter } from "next/navigation";
import { showToast } from "nextjs-toast-notify";

export const useEditProductForm = (product: Product) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [form, setForm] = useState({
    _id: product._id,
    name: product.name || "",
    description: product.description || "",
    category: product.category ? [product.category._id] : [],
    subcategories: product.subcategories
      ? product.subcategories.map((s) => s._id)
      : [],
    variants: product.variants || [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCategory = (value: string[]) =>
    setForm({ ...form, category: value });

  const handleSubcategories = (value: string[]) =>
    setForm({ ...form, subcategories: value });

  const addVariant = () => {
    setForm({
      ...form,
      variants: [
        ...form.variants,
        {
          type: "",
          price: 0,
          is_offer: false,
          price_offer: 0,
          color: "",
          images: [],
          sizes: [{ size: "S", stock: 0 }],
          size_chart: "",
        },
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
        category: form.category[0],
        subcategories: form.subcategories,
        variants: form.variants,
      });
      showToast.success("¡Producto actualizado exitósamente!", {
        duration: 4000,
        progress: true,
        position: "top-center",
        transition: "bounceIn",
        icon: '',
        sound: true,
      });
      router.push("/admin/products");
    } catch (err) {
      showToast.error("Error al actualizar el producto", {
        duration: 4000,
        progress: true,
        position: "top-center",
        transition: "bounceIn",
        icon: '',
        sound: true,
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
    addVariant,
    updateVariant,
    addSizeToVariant,
    handleUploadImage,
    handleRemoveImage,
    handleSubmit,
    isLoading,
    isUploadingImage,
  };
};
