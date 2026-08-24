import { EventoProducto } from '@/app/actions/eventos-admin';
import ProductCard from './ProductCard';

interface ProductGridProps {
    productos: EventoProducto[];
    basePath: string;
    searchQuery: string;
    onSearchChange: (val: string) => void;
    sortBy: string;
    onSortChange: (val: string) => void;
}

export default function ProductGrid({ 
    productos, 
    basePath, 
    searchQuery, 
    onSearchChange,
    sortBy,
    onSortChange
}: ProductGridProps) {
    return (
        <div className="flex-1 w-full">
            {/* Top Bar: Search & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm py-2"
                    />
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-sm text-gray-500 whitespace-nowrap hidden md:inline">
                        {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
                    </span>
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="block w-full sm:w-auto rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm py-2"
                    >
                        <option value="name-asc">Nombre: A-Z</option>
                        <option value="name-desc">Nombre: Z-A</option>
                        <option value="price-asc">Precio: Menor a Mayor</option>
                        <option value="price-desc">Precio: Mayor a Menor</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productos.map(producto => (
                    <ProductCard key={producto.id} producto={producto} basePath={basePath} />
                ))}
            </div>

            {/* Empty State */}
            {productos.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron productos</h3>
                    <p className="text-gray-500 text-sm">Intenta ajustar tu búsqueda o filtros para ver más resultados.</p>
                </div>
            )}
        </div>
    );
}
