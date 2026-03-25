import { getMenu } from '@/app/actions/menu';
import MenuSection from "@/components/cartaimprimir/MenuSection";
import "@/styles/cartaimprimir.css";
import { Product } from '@/types/menu';
import Image from 'next/image';

// Categorías definidas para cada página
const PAGE1_CATEGORIES = [
    'Combos', 'Pizzas', 'Empanadas', 'Hamburguesas',
    'Sandwich', 'Completos', 'Papas', 'Desayuno'
];

const PAGE2_CATEGORIES = [
    'Postres', 'Helados', 'Bebidas', 'Pastelería'
];

// Helper to group items by category
const groupItemsByCategory = (items: Product[], allowedCategories: string[]) => {
    const groups: Record<string, any[]> = {};

    items.forEach(item => {
        if (item.gestionar_stock === 1 && item.stock <= 0) return;
        const category = item.categoria || 'Otros';

        // Solo incluir si está en las categorías permitidas
        if (!allowedCategories.includes(category)) return;

        if (!groups[category]) groups[category] = [];

        groups[category].push({
            name: item.nombre,
            price: item.precio,
            ingredients: item.ingredientes,
            stock: item.stock,
            gestionar_stock: item.gestionar_stock
        });
    });

    // Mantener el orden de las categorías según la lista permitida
    return allowedCategories
        .filter(cat => groups[cat]) // Solo incluir si tiene elementos
        .map(name => ({
            name,
            items: groups[name]
        }));
};

// Componente para las ilustraciones line art (Imágenes generadas de alta calidad)
const LineArt = () => {
    return (
        <Image
            src="/menu_art_pizza_wheat_1771626976622.png"
            alt="Fondo decorativo"
            fill
            className="line-art"
            style={{ objectFit: 'cover', opacity: 0.08 }}
        />
    );
};

const LineArtPage2 = () => {
    return (
        <Image
            src="/menu_art_coffee_dessert_1771626990153.png"
            alt="Fondo decorativo"
            fill
            className="line-art"
            style={{ objectFit: 'cover', opacity: 0.08 }}
        />
    );
}

export default async function CartaClasicaPage() {
    const menuItems = await getMenu();

    const page1Sections = groupItemsByCategory(menuItems, PAGE1_CATEGORIES);
    const page2Sections = groupItemsByCategory(menuItems, PAGE2_CATEGORIES);

    return (
        <div className="min-h-screen bg-neutral-100 text-black flex flex-col items-center">

            {/* PAGINA 1 */}
            <div className="print-page">
                <LineArt />

                <header className="menu-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '220px', height: '120px', marginBottom: '5px' }}>
                        <Image
                            src="/logo.webp"
                            alt="Logo Pastelería Hijitos"
                            fill
                            className="object-contain"
                        />
                    </div>
                </header>

                <div className="page-content cols-4">
                    {page1Sections.length > 0 ? (
                        page1Sections.map((section, index) => (
                            <MenuSection key={index} name={section.name} items={section.items} />
                        ))
                    ) : (
                        <p className="text-center">Cargando menú...</p>
                    )}
                </div>
            </div>

            {/* PAGINA 2 */}
            <div className="print-page">
                <LineArtPage2 />

                <header className="menu-header">
                </header>

                <div className="page-content cols-3">
                    {page2Sections.length > 0 ? (
                        page2Sections.map((section, index) => (
                            <MenuSection key={index} name={section.name} items={section.items} />
                        ))
                    ) : (
                        <p className="text-center">Cargando menú...</p>
                    )}
                </div>

                {/* Espacio para el Código QR posicionado abajo a la izquierda, alienado al margen real */}
                <div className="qr-section" style={{ position: 'absolute', bottom: '15mm', left: '15mm', padding: '0', background: 'transparent', borderRadius: '8px', zIndex: 20 }}>
                    <img
                        src="https://imagenes.pasteleriahijitos.cl/qr-sucursal-logo.webp"
                        alt="Código QR Pastelería Hijitos"
                        width="180"
                        height="180"
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            </div>

        </div>
    );
}
