import { getProductById } from '@/app/actions/products-update';
import { getCategories } from '@/app/actions/categories';
import ProductForm from '@/components/ventas/ProductForm';
import { notFound } from 'next/navigation';

export const runtime = 'edge';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Handle "nuevo" case
    if (id === 'nuevo') {
        const categories = await getCategories();
        // Return form with empty product for creation
        const newProduct = {
            id: 0, // 0 indicates new
            nombre: '',
            descripcion: '',
            precio: 0,
            categoria: '',
            categoria_id: categories[0]?.id || 0,
            imagen_url: '',
            disponible: 1,
            stock: 0,
            gestionar_stock: 0,
            ingredientes: ''
        };
        return (
            <div>
                <ProductForm product={newProduct} categories={categories} />
            </div>
        );
    }

    // Existing edit logic
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
