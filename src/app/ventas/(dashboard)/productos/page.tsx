import { getAdminProducts } from '@/app/actions/admin-products';
import ProductList from '@/components/ventas/ProductList';

export const runtime = 'edge';

export default async function VentasPage() {
    const products = await getAdminProducts();

    return (
        <div>
            <ProductList products={products} />
        </div>
    );
}
