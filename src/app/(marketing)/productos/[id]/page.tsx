import { notFound } from 'next/navigation';
import { getEventoProducto } from '@/app/actions/eventos-admin';
import ProductDetailClient from '@/components/ecommerce/ProductDetailClient';
import Breadcrumb from '@/components/ecommerce/Breadcrumb';
import CotizadorFloatingButton from '@/components/CotizadorFloatingButton';

export const runtime = 'edge';

interface ProductPageProps {
    params: {
        id: string;
    };
    searchParams: {
        from?: string;
    }
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
        notFound();
    }

    const producto = await getEventoProducto(id);

    if (!producto) {
        notFound();
    }

    // No longer need to differentiate between dulces and salados
    let parentLabel = 'Coctelería';
    let parentHref = '/cocteleria';

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-6 max-w-6xl">
                <Breadcrumb items={[
                    { label: 'Inicio', href: '/' },
                    { label: parentLabel, href: parentHref },
                    { label: producto.nombre }
                ]} />

                <ProductDetailClient producto={producto} />
            </div>

            <CotizadorFloatingButton />
        </main>
    );
}
