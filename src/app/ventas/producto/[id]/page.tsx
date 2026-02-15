import { getProductById } from '@/app/actions/products-update';
import { getCategories } from '@/app/actions/categories';
import ProductForm from '@/components/ventas/ProductForm';
import { notFound } from 'next/navigation';

export const runtime = 'edge';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // In a real app we might handle "nuevo" here too or separately
    // But route is /producto/[id], so verify if numeric
    const productId = parseInt(id);
    if (isNaN(productId)) {
        return <div>Invalid Product ID</div>; // Or redirect
    }

    const product = await getProductById(productId);
    const categories = await getCategories();

    if (!product) {
        notFound();
    }

    return (
        <div>
            <ProductForm product={product} categories={categories} />
        </div>
    );
}
