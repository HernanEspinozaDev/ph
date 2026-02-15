'use client';

import { AdminProduct } from '@/app/actions/admin-products';
import ProductQuickActions from '@/components/ventas/ProductQuickActions';
import Link from 'next/link';
import { useState, useMemo } from 'react';

export default function ProductList({ products }: { products: AdminProduct[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter and Group Products
    const groupedProducts = useMemo(() => {
        const filtered = products.filter(p =>
            p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const groups: { [key: string]: AdminProduct[] } = {};

        filtered.forEach(product => {
            const cat = product.categoria || 'Sin Categoría';
            if (!groups[cat]) {
                groups[cat] = [];
            }
            groups[cat].push(product);
        });

        // Sort categories alphabetically or by some order if available (here just keys)
        return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
    }, [products, searchTerm]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-gray-800">Productos</h1>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                    />
                    <Link
                        href="/ventas/producto/nuevo"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 text-center whitespace-nowrap"
                    >
                        + Nuevo Producto
                    </Link>
                </div>
            </div>

            {groupedProducts.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
                    No se encontraron productos.
                </div>
            ) : (
                groupedProducts.map(([categoryName, categoryProducts]) => (
                    <div key={categoryName} className="space-y-3">
                        <h2 className="text-xl font-bold text-gray-700 border-b border-gray-300 pb-2 pl-2">
                            {categoryName} <span className="text-sm font-normal text-gray-500">({categoryProducts.length})</span>
                        </h2>

                        {/* Desktop Table for this Category */}
                        <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                            Img
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Producto
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Precio
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Control Rápido (Disponibilidad / Stock)
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {categoryProducts.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 overflow-hidden">
                                                        {product.imagen_url ? (
                                                            <img src={product.imagen_url} alt={product.nombre} className="h-full w-full object-cover" />
                                                        ) : 'N/A'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">${product.precio.toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex justify-center">
                                                    <div className="w-64">
                                                        <ProductQuickActions
                                                            id={product.id}
                                                            disponible={product.disponible === 1}
                                                            gestionarStock={product.gestionar_stock === 1}
                                                            stock={product.stock}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link href={`/ventas/producto/${product.id}`} className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md">
                                                    Editar
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards for this Category */}
                        <div className="md:hidden grid grid-cols-1 gap-4">
                            {categoryProducts.map((product) => (
                                <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                                                {product.imagen_url ? (
                                                    <img src={product.imagen_url} alt={product.nombre} className="h-full w-full object-cover" />
                                                ) : <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">Sin img</div>}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{product.nombre}</h3>
                                                <p className="text-sm text-gray-500 font-bold">${product.precio.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <Link href={`/ventas/producto/${product.id}`} className="text-blue-600 bg-blue-50 px-3 py-1 rounded-md text-sm font-medium">
                                            Editar
                                        </Link>
                                    </div>

                                    <div className="border-t border-gray-100 pt-3">
                                        <ProductQuickActions
                                            id={product.id}
                                            disponible={product.disponible === 1}
                                            gestionarStock={product.gestionar_stock === 1}
                                            stock={product.stock}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
