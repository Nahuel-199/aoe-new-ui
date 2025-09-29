import { useState } from "react";
import { imageUpload } from "@/utils/uploadCloudinary";
import { createProduct } from "@/lib/actions/product.actions";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

export const useNewProductForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: [] as string[],
    subcategories: [] as string[],
    variants: [] as any[],
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
          price: "",
          is_offer: false,
          price_offer: "",
          color: "",
          images: [],
          sizes: [{ size: "S", stock: 0 }],
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
      await createProduct({
        name: form.name,
        description: form.description,
        category: form.category[0],
        subcategories: form.subcategories,
        variants: form.variants,
      });

      setForm({
        name: "",
        description: "",
        category: [],
        subcategories: [],
        variants: [],
      });
      toaster.success({
        title: "Producto creado exitósamente",
        duration: 3000,
      });
      router.push("/admin/products");
    } catch (err) {
      toaster.error({
        title: "Error al crear el producto",
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
    addVariant,
    updateVariant,
    addSizeToVariant,
    handleUploadImage,
    handleRemoveImage,
    handleSubmit,
    isLoading,
  };
};
