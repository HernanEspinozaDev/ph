import { getEventoProductos } from '@/app/actions/eventos-admin';
import CotizadorFloatingButton from '@/components/CotizadorFloatingButton';
import CatalogClient from '@/components/ecommerce/CatalogClient';
import Breadcrumb from '@/components/ecommerce/Breadcrumb';

export const runtime = 'edge';

export default async function CocteleriaPage() {
    const todos = await getEventoProductos();
    // Filter active products only
    const cocteleria = todos.filter(p => p.activo === 1);

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-6">
                
                <Breadcrumb items={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Coctelería' }
                ]} />

                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Coctelería y Catering</h1>
                    <p className="text-lg text-gray-600 font-light">
                        Descubre nuestra exquisita variedad de opciones dulces y saladas. 
                        Ideales para reuniones de empresa, cumpleaños o cualquier evento especial.
                    </p>
                </div>

                <CatalogClient productos={cocteleria} basePath="/productos" />
            </div>
            
            <CotizadorFloatingButton />
        </main>
    );
}
