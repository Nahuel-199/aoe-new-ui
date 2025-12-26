import { useState } from "react";
import { imageUpload } from "@/utils/uploadCloudinary";
import { createProduct } from "@/lib/actions/product.actions";
import { useRouter } from "next/navigation";
import { showToast } from "nextjs-toast-notify";

export const useNewProductForm = (onClose?: () => void) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          type: "",
          price: "",
          is_offer: false,
          price_offer: "",
          color: "",
          images: [],
          sizes: [],
          size_chart: "",
        },
      ],
    }));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...form.variants];
    newVariants[index][field] = value;

    if (field === "type") {
      if (value.toLowerCase() === "básica" || value.toLowerCase() === "basica") {
        newVariants[index].sizes = [
          { size: "S", stock: 0 },
          { size: "M", stock: 0 },
          { size: "L", stock: 0 },
          { size: "XL", stock: 0 },
          { size: "XXL", stock: 0 },
        ];
      } else if (value.toLowerCase() === "oversize" || value.toLowerCase() === "overzice") {
        newVariants[index].sizes = [
          { size: "S", stock: 0 },
          { size: "M", stock: 0 },
          { size: "L", stock: 0 },
          { size: "XL", stock: 0 },
        ];
      } else if (newVariants[index].sizes.length === 0) {
        newVariants[index].sizes = [{ size: "S", stock: 0 }];
      }
    }

    setForm({ ...form, variants: newVariants });
  };

  const addSizeToVariant = (index: number) => {
    const newVariants = [...form.variants];
    newVariants[index].sizes.push({ size: "M", stock: 0 });
    setForm({ ...form, variants: newVariants });
  };

  const removeVariant = (index: number) => {
    const newVariants = form.variants.filter((_, i) => i !== index);
    setForm({ ...form, variants: newVariants });
  };

  const removeSizeFromVariant = (variantIndex: number, sizeIndex: number) => {
    const newVariants = [...form.variants];
    newVariants[variantIndex].sizes = newVariants[variantIndex].sizes.filter(
      (_: any, i: number) => i !== sizeIndex
    );
    setForm({ ...form, variants: newVariants });
  };

  const handleUploadImage = async (index: number, files: File[]) => {
    if (files.length === 0) return;
    try {
      setIsUploadingImage(true);

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

      showToast.success("Imagen cargada correctamente", {
        duration: 2500,
        progress: true,
        position: "top-center",
      });
    } catch (err) {
      showToast.error("Error al subir imagen", {
        duration: 2500,
        progress: true,
        position: "top-center",
      });
    } finally {
      setIsUploadingImage(false);
    }
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

      showToast.success("¡Producto creado exitosamente!", {
        duration: 4000,
        progress: true,
        position: "top-center",
        transition: "bounceIn",
      });

      if (onClose) {
        onClose();
      } else {
        router.push("/admin/products");
      }
    } catch (err) {
      showToast.error("Error al crear el producto", {
        duration: 4000,
        progress: true,
        position: "top-center",
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
    removeVariant,
    updateVariant,
    addSizeToVariant,
    removeSizeFromVariant,
    handleUploadImage,
    handleRemoveImage,
    handleSubmit,
    isLoading,
    isUploadingImage,
  };
};
