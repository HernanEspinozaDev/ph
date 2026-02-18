
import Image from 'next/image';
import { getMenu } from '@/app/actions/menu';
import MenuSection from "@/components/cartaclasica/MenuSection";
import "@/styles/menu.css";
import { Product } from '@/types/menu';
import { SocialLinks } from '@/components/SocialLinks';

export const runtime = 'edge';

// Helper to group items by category
const groupItemsByCategory = (items: Product[]) => {
    const groups: Record<string, any[]> = {};

    items.forEach(item => {
        // Filter out items with stock management enabled and 0 stock
        if (item.gestionar_stock === 1 && item.stock <= 0) {
            return;
        }

        const category = item.categoria || 'Otros';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push({
            name: item.nombre,
            price: item.precio,
            ingredients: item.ingredientes,
            imageUrl: item.imagen_url,
            stock: item.stock,
            gestionar_stock: item.gestionar_stock
        });
    });

    return Object.entries(groups).map(([name, items]) => ({
        name,
        items
    }));
};

export default async function CartaClasicaPage() {
    const menuItems = await getMenu();
    const sections = groupItemsByCategory(menuItems);

    return (
        <div className="min-h-screen bg-[#1c1c1c] text-white">
            <div className="menu-container">
                <header className="menu-header">
                    <div className="relative w-40 h-24 mx-auto mb-4">
                        <Image
                            src="/logo.webp"
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-amber-500 mb-2 font-dancing">Pastelería Hijitos</h1>
                        <div className="text-xl text-gray-400 font-light tracking-wide uppercase">Menú</div>
                        <div className="mt-4">
                            <SocialLinks className="text-gray-400" tikTokClassName="text-white" />
                        </div>
                    </div>
                </header>

                <main className="space-y-12 py-8">
                    {sections.length > 0 ? (
                        sections.map((section, index) => (
                            <MenuSection key={index} name={section.name} items={section.items} />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-10">
                            <p>Cargando menú...</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
