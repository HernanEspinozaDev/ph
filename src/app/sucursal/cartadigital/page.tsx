'use client';

import { useState } from 'react';
import { CATEGORIES, MENU_ITEMS, MENU_GROUPS, MenuItem } from '@/lib/menuData';
import { Button } from '@/components/ui/button'; // Used for "clean search"
import { useScrollSpy } from '@/features/menu/hooks/useScrollSpy';

// Feature Components
import { MenuSidebar } from '@/features/menu/components/MenuSidebar';
import { MobileMenuNav } from '@/features/menu/components/MobileMenuNav';
import { MenuSearch } from '@/features/menu/components/MenuSearch';
import { ProductCard } from '@/features/menu/components/ProductCard';
import { ProductModal } from '@/features/menu/components/ProductModal';

export default function MenuPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

    // IDs for scroll spy
    const groupIds = MENU_GROUPS.map(g => g.id);
    const { activeId, scrollToSection } = useScrollSpy(groupIds);

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans">

            {/* --- DESKTOP SIDEBAR --- */}
            <MenuSidebar
                activeGroup={activeId}
                onSelectGroup={(id) => scrollToSection(id, 0)} // Sidebar scroll usually 0 or header offset? old code had -100 but desktop sticky is simplified. 
            // Original: top: section.offsetTop - 100 for global, but desktop sidebar is fixed. 
            // Wait, desktop main content scrolls.
            />

            {/* --- MOBILE NAVBAR --- */}
            <MobileMenuNav
                activeGroup={activeId}
                onSelectGroup={(id) => scrollToSection(id)}
            />

            {/* --- MAIN CONTENT --- */}
            <div className="lg:pl-64">
                <MenuSearch value={searchQuery} onChange={setSearchQuery} />

                <div className="p-4 lg:p-8 space-y-12 max-w-5xl">
                    {MENU_GROUPS.map((group) => {
                        // Filter Items by Group
                        const groupCategories = CATEGORIES.filter(c => c.group === group.id).map(c => c.id);
                        const items = MENU_ITEMS.filter(item =>
                            groupCategories.includes(item.categoryId) &&
                            (searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        );

                        if (items.length === 0) return null;

                        return (
                            <section key={group.id} id={group.id} className="scroll-mt-32 lg:scroll-mt-24">
                                <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                                    {group.id === 'promociones' && <span className="text-2xl">🔥</span>}
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
                    {searchQuery && MENU_ITEMS.every(item => !item.name.toLowerCase().includes(searchQuery.toLowerCase())) && (
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
