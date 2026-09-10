'use client';

import { useState } from 'react';
import { Product } from '@/types/menu';
import { Button } from '@/components/ui/button';

// Feature Components
import { MenuSearch } from '@/features/menu/components/MenuSearch';
import { ProductCard } from '@/features/menu/components/ProductCard';
import { ProductModal } from '@/features/menu/components/ProductModal';

export default function PasteleriaClient({ products }: { products: Product[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Filtrar los ítems en base a la búsqueda
    const items = products.filter(item =>
        searchQuery === '' || item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full text-slate-800 font-sans">
            
            <div className="max-w-4xl mx-auto">
                <MenuSearch 
                    value={searchQuery} 
                    onChange={setSearchQuery} 
                    placeholder="Buscar en la pastelería (ej. alfajor, kuchen, pie)..." 
                />
            </div>

            <div className="py-8 space-y-12 max-w-5xl mx-auto">
                {items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                        {items.map((item) => (
                            <ProductCard
                                key={item.id}
                                item={item}
                                onClick={setSelectedProduct}
                                theme="pasteleria"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-stone-400">No encontramos productos con "{searchQuery}"</p>
                        <Button variant="link" onClick={() => setSearchQuery('')}>Limpiar búsqueda</Button>
                    </div>
                )}
            </div>

            {/* --- MODAL --- */}
            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                theme="pasteleria"
            />
        </div>
    );
}
