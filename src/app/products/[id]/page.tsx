import ProductDetails from "@/_components/products/id/ProductDetails";
import { getProductById } from "@/lib/actions/product.actions";

interface EditProductPageProps {
  params: { id: string };
}

const Page = async ({ params }: EditProductPageProps) => {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    return (
      <div>
        <p>Producto no encontrado.</p>
      </div>
    );
  }

  return <ProductDetails product={product} />;
};

export default Page;
