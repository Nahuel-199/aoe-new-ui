import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "nextjs-toast-notify";
import { imageUpload } from "@/utils/uploadCloudinary";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { Product, type VariantInput, type ImageInput } from "@/types/product.types";

export interface VariantFormState extends Omit<VariantInput, "price" | "price_offer"> {
  price: number | string;
  price_offer: number | string;
}

interface ProductFormState {
  _id?: string;
  name: string;
  description: string;
  category: string[];
  subcategories: string[];
  variants: VariantFormState[];
}

const emptyVariant = (): VariantFormState => ({
  type: "",
  price: "",
  is_offer: false,
  price_offer: "",
  color: "",
  images: [],
  sizes: [],
  size_chart: "",
});

const emptyForm = (): ProductFormState => ({
  name: "",
  description: "",
  category: [],
  subcategories: [],
  variants: [],
});

const formFromProduct = (product: Product): ProductFormState => ({
  _id: product._id,
  name: product.name || "",
  description: product.description || "",
  category: product.category ? [product.category._id] : [],
  subcategories: product.subcategories ? product.subcategories.map((s) => s._id) : [],
  variants: (product.variants || []) as VariantFormState[],
});

const SIZE_PRESETS: Record<string, { size: string; stock: number }[]> = {
  "básica": ["S", "M", "L", "XL", "XXL"].map((size) => ({ size, stock: 0 })),
  "basica": ["S", "M", "L", "XL", "XXL"].map((size) => ({ size, stock: 0 })),
  "oversize": ["S", "M", "L", "XL"].map((size) => ({ size, stock: 0 })),
  "overzice": ["S", "M", "L", "XL"].map((size) => ({ size, stock: 0 })),
};

interface UseProductFormOptions {
  mode: "create" | "edit";
  product?: Product;
  onClose?: () => void;
}

/**
 * Único hook para el form de alta/edición de productos del admin — antes
 * eran dos hooks (`useNewProductForm`/`useEditProductForm`) que duplicaban
 * toda la lógica de variantes/imágenes/talles. `ProductFormContainer`
 * elegía uno u otro según `mode`, lo cual violaba las Rules of Hooks
 * (hook llamado condicionalmente). Ahora se llama siempre este mismo hook.
 */
export const useProductForm = ({ mode, product, onClose }: UseProductFormOptions) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [form, setForm] = useState<ProductFormState>(() =>
    mode === "edit" && product ? formFromProduct(product) : emptyForm()
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCategory = (value: string[]) => setForm({ ...form, category: value });

  const handleSubcategories = (value: string[]) =>
    setForm({ ...form, subcategories: value });

  const addVariant = () => {
    setForm((prev) => ({ ...prev, variants: [...prev.variants, emptyVariant()] }));
  };

  const updateVariant = (
    index: number,
    field: keyof VariantFormState,
    value: VariantFormState[keyof VariantFormState]
  ) => {
    const newVariants = [...form.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };

    if (field === "type" && typeof value === "string") {
      const preset = SIZE_PRESETS[value.toLowerCase()];
      if (preset) {
        newVariants[index].sizes = preset;
      } else if (newVariants[index].sizes.length === 0) {
        newVariants[index].sizes = [{ size: "S", stock: 0 }];
      }
    }

    setForm({ ...form, variants: newVariants });
  };

  const addSizeToVariant = (index: number) => {
    const newVariants = [...form.variants];
    newVariants[index].sizes = [...newVariants[index].sizes, { size: "M", stock: 0 }];
    setForm({ ...form, variants: newVariants });
  };

  const removeVariant = (index: number) => {
    setForm({ ...form, variants: form.variants.filter((_, i) => i !== index) });
  };

  const removeSizeFromVariant = (variantIndex: number, sizeIndex: number) => {
    const newVariants = [...form.variants];
    newVariants[variantIndex].sizes = newVariants[variantIndex].sizes.filter(
      (_, i) => i !== sizeIndex
    );
    setForm({ ...form, variants: newVariants });
  };

  const handleUploadImage = async (index: number, files: File[]) => {
    if (files.length === 0) return;
    try {
      setIsUploadingImage(true);

      const uploaded = await imageUpload(files);
      const formattedImages: ImageInput[] = uploaded.map((img) => ({
        id: img.public_id,
        url: img.url,
      }));

      const newVariants = [...form.variants];
      newVariants[index].images = [...newVariants[index].images, ...formattedImages];
      setForm({ ...form, variants: newVariants });

      showToast.success("Imagen cargada correctamente", {
        duration: 2500,
        progress: true,
        position: "top-center",
      });
    } catch {
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
    newVariants[variantIndex].images = newVariants[variantIndex].images.filter(
      (_, i) => i !== imgIndex
    );
    setForm({ ...form, variants: newVariants });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const payload = {
        name: form.name,
        description: form.description,
        category: form.category[0],
        subcategories: form.subcategories,
        variants: form.variants.map((v) => ({
          ...v,
          price: Number(v.price) || 0,
          price_offer: v.price_offer === "" ? undefined : Number(v.price_offer),
        })),
      };

      if (mode === "create") {
        await createProduct(payload);
        setForm(emptyForm());
        showToast.success("¡Producto creado exitosamente!", {
          duration: 4000,
          progress: true,
          position: "top-center",
          transition: "bounceIn",
        });
      } else {
        await updateProduct(form._id!, payload);
        showToast.success("¡Producto actualizado exitósamente!", {
          duration: 4000,
          progress: true,
          position: "top-center",
          transition: "bounceIn",
        });
      }

      if (onClose) onClose();
      else router.push("/admin/products");
    } catch {
      showToast.error(
        mode === "create" ? "Error al crear el producto" : "Error al actualizar el producto",
        { duration: 4000, progress: true, position: "top-center" }
      );
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
