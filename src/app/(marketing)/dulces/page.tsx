import { getEventoProductos } from '@/app/actions/eventos-admin';
import CotizadorFloatingButton from '@/components/CotizadorFloatingButton';
import CatalogClient from '@/components/ecommerce/CatalogClient';
import Breadcrumb from '@/components/ecommerce/Breadcrumb';

export const runtime = 'edge';

export default async function DulcesPage() {
    const todos = await getEventoProductos();
    // Filter active and category dulce
    const dulces = todos.filter(p => p.activo === 1 && p.categoria === 'dulce');

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-6">
                
                <Breadcrumb items={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Coctelería', href: '#' },
                    { label: 'Dulces' }
                ]} />

                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Catering Dulce</h1>
                    <p className="text-lg text-gray-600 font-light">
                        Agrega un toque dulce a tus celebraciones con nuestra selección de repostería en formato cóctel. 
                        Elaborados con la misma calidad artesanal de siempre, perfectos para compartir.
                    </p>
                </div>

                <CatalogClient productos={dulces} basePath="/dulces" />
            </div>
            
            <CotizadorFloatingButton />
        </main>
    );
}
