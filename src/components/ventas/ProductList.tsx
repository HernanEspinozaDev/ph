'use client';

import { AdminProduct } from '@/app/actions/admin-products';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import Link from 'next/link';

export default function ProductList({ products }: { products: AdminProduct[] }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
                <Link
                    href="/ventas/producto/nuevo"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                    + Nuevo Producto
                </Link>
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Imagen
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Producto
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Categoría
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Precio
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Disponible
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="h-10 w-10 flex-shrink-0">
                                        {/* Placeholder for image or actual image */}
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
                                    <div className="text-sm text-gray-500">{product.categoria}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">${product.precio.toLocaleString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <ToggleSwitch
                                            enabled={product.gestionar_stock === 1}
                                            srLabel="Gestionar Stock"
                                            onChange={() => { }} // Readonly for now in Phase 2.1
                                        />
                                        {product.gestionar_stock === 1 && (
                                            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {product.stock}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <ToggleSwitch
                                        enabled={product.disponible === 1}
                                        srLabel="Disponible"
                                        onChange={() => { }} // Readonly for now
                                    />
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

            {/* Mobile View - Cards */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {products.map((product) => (
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
                                    <p className="text-sm text-gray-500">{product.categoria}</p>
                                </div>
                            </div>
                            <span className="text-lg font-bold text-blue-600">${product.precio.toLocaleString()}</span>
                        </div>

                        <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1">
                                <span className="text-xs text-gray-500 uppercase font-semibold">Stock</span>
                                <div className="flex items-center space-x-2">
                                    <ToggleSwitch enabled={product.gestionar_stock === 1} onChange={() => { }} />
                                    {product.gestionar_stock === 1 && <span className="text-sm font-medium">{product.stock}</span>}
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <span className="text-xs text-gray-500 uppercase font-semibold">Disponible</span>
                                <ToggleSwitch enabled={product.disponible === 1} onChange={() => { }} />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Link href={`/ventas/producto/${product.id}`} className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-md transition-colors">
                                Editar Producto
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
