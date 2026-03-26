import { getMenu } from '@/app/actions/menu';
import MenuItem from "@/components/cartaimprimir/MenuItem";
import "@/styles/cartaimprimir.css";
import { Product } from '@/types/menu';
import Image from 'next/image';

export const runtime = 'edge';

// Categorías definidas para cada página
const PAGE1_CATEGORIES = [
    'Combos', 'Pizzas', 'Empanadas', 'Hamburguesas',
    'Sandwich', 'Completos', 'Papas', 'Desayuno', 'Bebidas'
];

const PAGE2_CATEGORIES = [
    'Postres', 'Helados', 'Pastelería'
];

type LayoutItem = 
    | { type: 'header', title: string, weight: number }
    | { type: 'item', product: Product, weight: number };

const flattenSections = (items: Product[], allowedCategories: string[]) => {
    const groups: Record<string, Product[]> = {};

    items.forEach(item => {
        if (item.gestionar_stock === 1 && item.stock <= 0) return;
        const category = item.categoria || 'Otros';
        if (!allowedCategories.includes(category)) return;

        if (!groups[category]) groups[category] = [];
        groups[category].push(item);
    });

    const arr: LayoutItem[] = [];
    allowedCategories.forEach(cat => {
        const catItems = groups[cat];
        if (catItems && catItems.length > 0) {
            arr.push({ type: 'header', title: cat, weight: 3 });
            catItems.forEach(prod => {
                const hasDesc = !!prod.ingredientes;
                arr.push({ type: 'item', product: prod, weight: hasDesc ? 2 : 1.5 });
            });
        }
    });
    return arr;
};

const distribute = (items: LayoutItem[], columnShares: number[]) => {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const totalShares = columnShares.reduce((a, b) => a + b, 0);
    
    const columns: LayoutItem[][] = columnShares.map(() => []);
    let currentColumn = 0;
    let currentWeight = 0;
    
    for (const item of items) {
        const capacity = totalWeight * (columnShares[currentColumn] / totalShares);
        
        let shouldWrap = false;
        
        // Push the column boundary if we exceed projected capacity
        if (currentWeight + (item.weight * 0.5) > capacity && currentColumn < columnShares.length - 1) {
            shouldWrap = true;
        }
        
        // ORPHAN HEADER PROTECTION
        // 1. Proactively wrap if it's a header and we are too close to the edge of the column
        // We ensure there's room for at least the header (3) + 1 large item (2)
        if (item.type === 'header' && currentWeight + item.weight + 2 > capacity && currentColumn < columnShares.length - 1) {
            shouldWrap = true;
        }
        
        // 2. NEVER wrap if we literally just pushed a header
        const currColItems = columns[currentColumn];
        if (currColItems.length > 0 && currColItems[currColItems.length - 1].type === 'header') {
            shouldWrap = false;
        }

        if (shouldWrap) {
            currentColumn++;
            currentWeight = 0;
        }
        
        currentWeight += item.weight;
        columns[currentColumn].push(item);
    }
    return columns;
};

const RenderColumn = ({ items, className }: { items: LayoutItem[], className?: string }) => {
    return (
        <div className={`flex-1 flex flex-col gap-y-[2mm] ${className || ''}`}>
            {items.map((it, idx) => {
                if (it.type === 'header') {
                    return (
                        <h2 key={idx} className="text-[14pt] leading-tight font-bold text-black border-b-[2px] border-black pb-[1mm] mb-[1mm] mt-[3mm] first:mt-0">
                            {it.title}
                        </h2>
                    );
                }
                return <MenuItem key={idx} name={it.product.nombre} ingredients={it.product.ingredientes || undefined} price={it.product.precio} stock={it.product.stock} gestionar_stock={it.product.gestionar_stock} />;
            })}
        </div>
    );
};

const LineArt = () => (
    <Image src="/menu_art_pizza_wheat_1771626976622.png" alt="Fondo decorativo" fill className="line-art" style={{ objectFit: 'cover', opacity: 0.1 }} />
);

const LineArtPage2 = () => (
    <Image src="/menu_art_coffee_dessert_1771626990153.png" alt="Fondo decorativo" fill className="line-art" style={{ objectFit: 'cover', opacity: 0.1 }} />
);

export default async function CartaClasicaPage() {
    const menuItems = await getMenu();

    const flat1 = flattenSections(menuItems, PAGE1_CATEGORIES);
    const flat2 = flattenSections(menuItems, PAGE2_CATEGORIES);

    // Page 1: Col 2 y 3 tienen un offset por el logo, pesan menos visualmente 
    const page1Cols = distribute(flat1, [1.0, 0.75, 0.75, 1.0]);
    
    // Page 2: Col 1 tiene el QR, por lo que pesa menos visualmente, pero le damos más espacio (0.85) para que quepan todos los Helados
    const page2Cols = distribute(flat2, [0.85, 1.0, 1.0]);

    return (
        <div className="min-h-screen bg-neutral-100 text-black flex flex-col items-center">
            {/* PAGINA 1 */}
            <div className="print-page relative">
                <LineArt />
                
                {/* Logo absoluto en el top center */}
                <div className="absolute top-[0] left-1/2 -translate-x-1/2 w-[220px] h-[120px] z-20">
                    <Image src="/logo.webp" alt="Logo Pastelería Hijitos" fill className="object-contain" priority />
                </div>

                <div className="relative z-10 flex gap-x-[6mm] h-full">
                    <RenderColumn items={page1Cols[0]} />
                    {/* Column 2 and 3 bajadas artificialmente para acomodar logo */}
                    <RenderColumn items={page1Cols[1]} className="pt-[95px]" />
                    <RenderColumn items={page1Cols[2]} className="pt-[95px]" />
                    <RenderColumn items={page1Cols[3]} />
                </div>
            </div>

            {/* PAGINA 2 */}
            <div className="print-page relative">
                <LineArtPage2 />

                <div className="relative z-10 flex gap-x-[6mm] h-full" style={{ paddingBottom: '0mm' }}>
                    {/* Columna 1 con espacio reservado natural en la base por tener menos distribución */}
                    <RenderColumn items={page2Cols[0]} />
                    <RenderColumn items={page2Cols[1]} />
                    <RenderColumn items={page2Cols[2]} />
                </div>

                <div className="qr-section absolute bottom-[15mm] left-[15mm] z-20 bg-white p-1 rounded">
                    <img
                        src="https://imagenes.pasteleriahijitos.cl/qr-sucursal-logo.webp"
                        alt="Código QR Pastelería Hijitos"
                        width="160"
                        height="160"
                        className="object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
