'use client';

import { useState } from 'react';
import { Product, MenuGroup } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { useScrollSpy } from '@/features/menu/hooks/useScrollSpy';

// Feature Components
import { MenuSidebar } from '@/features/menu/components/MenuSidebar';
import { MobileMenuNav } from '@/features/menu/components/MobileMenuNav';
import { MenuSearch } from '@/features/menu/components/MenuSearch';
import { ProductCard } from '@/features/menu/components/ProductCard';
import { ProductModal } from '@/features/menu/components/ProductModal';

export default function MenuClient({ products }: { products: Product[], groups?: any }) {
    // Derive groups from products to ensure we have all dynamic categories from DB
    // The products are already sorted by category order in getMenu
    const groups = Array.from(new Set(products.map(p => p.categoria))).map(catName => ({
        id: catName,
        label: catName
    }));

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // IDs for scroll spy
    const groupIds = groups.map(g => g.id);
    const { activeId, scrollToSection } = useScrollSpy(groupIds);

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans">

            {/* --- DESKTOP SIDEBAR --- */}
            <MenuSidebar
                activeGroup={activeId}
                onSelectGroup={(id) => scrollToSection(id, 0)}
                groups={groups}
            />

            {/* --- MOBILE NAVBAR --- */}
            <MobileMenuNav
                activeGroup={activeId}
                onSelectGroup={(id) => scrollToSection(id)}
                groups={groups}
            />

            {/* --- MAIN CONTENT --- */}
            <div className="lg:pl-64">
                <MenuSearch value={searchQuery} onChange={setSearchQuery} />

                <div className="p-4 lg:p-8 space-y-12 max-w-5xl">
                    {groups.map((group) => {
                        // Filter Items by Group/Category
                        // We assume group.id is the category name from D1 for simplicity in mapping
                        // OR we map D1 category to group.id.
                        // Let's assume strict equality for now: group.id === product.categoria

                        const items = products.filter(item =>
                            item.categoria === group.id &&
                            (searchQuery === '' || item.nombre.toLowerCase().includes(searchQuery.toLowerCase()))
                        );

                        if (items.length === 0) return null;

                        return (
                            <section key={group.id} id={group.id} className="scroll-mt-48 lg:scroll-mt-40">
                                <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                                    {group.id.toLowerCase() === 'promociones' && <span className="text-2xl">🔥</span>}
                                    {group.label}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                                    {items.map((item) => (
                                        <ProductCard
                                            key={item.id}
                                            item={item}
                                            onClick={setSelectedProduct}
                                        />
                                    ))}
                                </div>
                            </section>
                        )
                    })}

                    {/* Not found state */}
                    {searchQuery && products.every(item => !item.nombre.toLowerCase().includes(searchQuery.toLowerCase())) && (
                        <div className="text-center py-20">
                            <p className="text-stone-400">No encontramos productos con "{searchQuery}"</p>
                            <Button variant="link" onClick={() => setSearchQuery('')}>Limpiar búsqueda</Button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL --- */}
            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
}
