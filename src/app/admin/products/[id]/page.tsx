import ProductById from "@/_components/admin/products/id/ProductById";
import { getCategories } from "@/lib/actions/category.actions";
import { getProductById } from "@/lib/actions/product.actions";
import { getSubcategories } from "@/lib/actions/subcategory.actions";


interface EditProductPageProps {
    params: { id: string };
}

const Page = async ({ params }: EditProductPageProps) => {
    const { id } = await params;

    const product = await getProductById(id);
    const categories = await getCategories();
    const subcategories = await getSubcategories();

    if (!product) {
        return (
            <div>
                <p>Producto no encontrado.</p>
            </div>
        );
    }

    return <ProductById
        product={product}
        categories={categories}
        subcategories={subcategories}
    />;
};

export default Page;