'use client';

import { useState, useMemo } from 'react';
import { EventoProducto } from '@/app/actions/eventos-admin';
import ProductFilters from './ProductFilters';
import ProductGrid from './ProductGrid';

interface CatalogClientProps {
    productos: EventoProducto[];
    basePath: string;
}

export default function CatalogClient({ productos, basePath }: CatalogClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name-asc');
    
    const maxPrice = productos.length > 0 ? Math.max(...productos.map(p => p.precio_unitario)) : 10000;
    const [priceRange, setPriceRange] = useState({ min: 0, max: maxPrice });

    const handleReset = () => {
        setSearchQuery('');
        setSortBy('name-asc');
        setPriceRange({ min: 0, max: maxPrice });
    };

    const filteredAndSortedProducts = useMemo(() => {
        let result = productos;

        // Search Filter
        if (searchQuery.trim()) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(p => 
                p.nombre.toLowerCase().includes(lowerQuery) || 
                (p.descripcion && p.descripcion.toLowerCase().includes(lowerQuery))
            );
        }

        // Price Filter
        result = result.filter(p => p.precio_unitario >= priceRange.min && p.precio_unitario <= priceRange.max);

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'name-asc') return a.nombre.localeCompare(b.nombre);
            if (sortBy === 'name-desc') return b.nombre.localeCompare(a.nombre);
            if (sortBy === 'price-asc') return a.precio_unitario - b.precio_unitario;
            if (sortBy === 'price-desc') return b.precio_unitario - a.precio_unitario;
            return 0;
        });

        return result;
    }, [productos, searchQuery, priceRange, sortBy]);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <ProductFilters 
                priceRange={priceRange} 
                onPriceChange={setPriceRange} 
                maxAvailablePrice={maxPrice} 
                onReset={handleReset} 
            />
            <ProductGrid 
                productos={filteredAndSortedProducts} 
                basePath={basePath}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
            />
        </div>
    );
}
