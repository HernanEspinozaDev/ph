import { getEventoProductos } from '@/app/actions/eventos-admin';
import CotizadorFloatingButton from '@/components/CotizadorFloatingButton';
import CatalogClient from '@/components/ecommerce/CatalogClient';
import Breadcrumb from '@/components/ecommerce/Breadcrumb';

export const runtime = 'edge';

export default async function SaladosPage() {
    const todos = await getEventoProductos();
    // Filter active and category salado
    const salados = todos.filter(p => p.activo === 1 && p.categoria === 'salado');

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-6">
                
                <Breadcrumb items={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Coctelería', href: '#' },
                    { label: 'Salados' }
                ]} />

                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Catering Salado</h1>
                    <p className="text-lg text-gray-600 font-light">
                        Descubre nuestra exquisita variedad de tapaditos, empanaditas y bocados salados. 
                        Ideales para reuniones de empresa, cumpleaños o cualquier evento especial.
                    </p>
                </div>

                <CatalogClient productos={salados} basePath="/salados" />
            </div>
            
            <CotizadorFloatingButton />
        </main>
    );
}
