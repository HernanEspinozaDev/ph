'use client';

import Link from 'next/link';
import { EventoProducto } from '@/app/actions/eventos-admin';
import { useCotizadorStore } from '@/hooks/useCotizadorStore';

export default function ProductCard({ producto, basePath }: { producto: EventoProducto, basePath: string }) {
    const minQty = producto.cantidad_minima || 1;
    const step = producto.incremento || 1;
    
    const addItem = useCotizadorStore(state => state.addItem);

    const imagenes = producto.imagenes?.length 
        ? producto.imagenes.sort((a, b) => b.es_principal - a.es_principal)
        : [];
        
    const mainImgUrl = imagenes.length > 0 ? imagenes[0].url : '/placeholder.png';

    const handleAddToCart = (e: React.MouseEvent, qty: number = minQty) => {
        e.preventDefault(); // Prevent navigating to PDP
        
        addItem({
            producto_id: producto.id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            cantidad: qty,
            precio_unitario: producto.precio_unitario,
            imagen_url: mainImgUrl,
            cantidad_minima: minQty,
            incremento: step
        });

        alert(`¡${qty} unidades agregadas al carrito!`);
    };

    const opcionesRapidas = producto.opciones_rapidas 
        ? producto.opciones_rapidas.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
        : [];

    return (
        <Link href={`/productos/${producto.id}?from=${basePath}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full relative cursor-pointer block">
            
            {/* Image */}
            <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden bg-gray-50">
                <img 
                    src={mainImgUrl} 
                    alt={producto.nombre} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            
            {/* Content */}
            <div className="p-5 flex flex-col flex-grow bg-white relative z-10">
                <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {producto.nombre}
                </h3>
                
                <p className="text-xs text-gray-500 mb-4 line-clamp-1">
                    {producto.categoria.charAt(0).toUpperCase() + producto.categoria.slice(1)}
                </p>
                
                <div className="mt-auto flex flex-col gap-3">
                    {/* Price and Min Qty */}
                    <div>
                        <div className="flex items-end gap-1">
                            <span className="text-xl font-bold text-gray-900">${producto.precio_unitario.toLocaleString('es-CL')}</span>
                            <span className="text-xs text-gray-500 mb-1 font-medium">c/u</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Desde {minQty} u.</p>
                    </div>

                    {/* Quick Options */}
                    {opcionesRapidas.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {opcionesRapidas.slice(0, 3).map(opcion => (
                                <button 
                                    key={opcion}
                                    onClick={(e) => handleAddToCart(e, Math.max(minQty, opcion))}
                                    className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                                >
                                    +{opcion}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Add to Cart Button */}
                    <button 
                        onClick={(e) => handleAddToCart(e, minQty)}
                        className="w-full bg-gray-100 text-gray-800 hover:bg-primary hover:text-white py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 mt-1"
                    >
                        Agregar
                    </button>
                </div>
            </div>
        </Link>
    );
}
