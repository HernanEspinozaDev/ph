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

    // Determine return path and label for breadcrumbs based on searchParams or category
    let parentLabel = 'Catálogo';
    let parentHref = '/';

    if (searchParams.from === '/dulces' || producto.categoria === 'dulce') {
        parentLabel = 'Dulces';
        parentHref = '/dulces';
    } else if (searchParams.from === '/salados' || producto.categoria === 'salado') {
        parentLabel = 'Salados';
        parentHref = '/salados';
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-6 max-w-6xl">
                <Breadcrumb items={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Coctelería', href: '#' },
                    { label: parentLabel, href: parentHref },
                    { label: producto.nombre }
                ]} />

                <ProductDetailClient producto={producto} />
            </div>

            <CotizadorFloatingButton />
        </main>
    );
}
