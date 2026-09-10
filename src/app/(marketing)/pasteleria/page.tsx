import { getMenu } from '@/app/actions/menu';
import PasteleriaClient from './PasteleriaClient';

export const runtime = 'edge';

export default async function PasteleriaPage() {
    const products = await getMenu();

    // Filtramos solo los productos de la categoría "Pastelería"
    const pasteles = products.filter(p => p.categoria?.toLowerCase() === 'pastelería' || p.categoria?.toLowerCase() === 'pasteleria');

    return (
        <main className="min-h-screen bg-[#FDFBF7] py-12">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Nuestros Pasteles</h1>
                    <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
                        Descubre nuestra selección de pasteles y tortas preparados con los mejores ingredientes,
                        siguiendo nuestras recetas tradicionales y el toque casero que te encanta.
                    </p>
                </div>
                
                <PasteleriaClient products={pasteles} />
            </div>
        </main>
    );
}
