'use client';

import { useState } from 'react';
import { EventoProducto } from '@/app/actions/eventos-admin';
import { useCotizadorStore } from '@/hooks/useCotizadorStore';

interface ProductDetailClientProps {
    producto: EventoProducto;
}

export default function ProductDetailClient({ producto }: ProductDetailClientProps) {
    const [mainImageIdx, setMainImageIdx] = useState(0);
    const minQty = producto.cantidad_minima || 1;
    const step = producto.incremento || 1;
    
    const [selectedQty, setSelectedQty] = useState<number>(minQty);
    const addItem = useCotizadorStore(state => state.addItem);

    const imagenes = producto.imagenes?.length 
        ? producto.imagenes.sort((a, b) => b.es_principal - a.es_principal)
        : [];
        
    const mainImgUrl = imagenes.length > 0 ? imagenes[mainImageIdx].url : '/placeholder.png';

    const handleAddToCart = () => {
        if (selectedQty < minQty) {
            alert(`La cantidad mínima es de ${minQty} unidades`);
            setSelectedQty(minQty);
            return;
        }

        addItem({
            producto_id: producto.id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            cantidad: selectedQty,
            precio_unitario: producto.precio_unitario,
            imagen_url: mainImgUrl,
            cantidad_minima: minQty,
            incremento: step
        });

        alert(`¡Agregaste ${selectedQty} unidades al carrito de cotización!`);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 flex flex-col md:flex-row gap-10">
            {/* Gallery Section */}
            <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-row gap-4">
                {/* Thumbnails */}
                {imagenes.length > 1 && (
                    <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto hide-scrollbar">
                        {imagenes.map((img, idx) => (
                            <button 
                                key={img.id} 
                                onClick={() => setMainImageIdx(idx)}
                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                                    idx === mainImageIdx 
                                    ? 'ring-2 ring-primary ring-offset-2 opacity-100' 
                                    : 'opacity-60 hover:opacity-100 hover:ring-2 hover:ring-gray-200 hover:ring-offset-1'
                                }`}
                            >
                                <img src={img.url} className="w-full h-full object-cover" alt="thumbnail" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Main Image */}
                <div className="flex-1 relative aspect-square md:aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    <img 
                        src={mainImgUrl} 
                        alt={producto.nombre} 
                        className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-primary shadow-sm">
                        {producto.categoria}
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="w-full md:w-1/2 flex flex-col">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                    {producto.nombre}
                </h1>
                
                <div className="flex items-end gap-2 mb-6">
                    <span className="text-4xl font-bold text-primary">${producto.precio_unitario.toLocaleString('es-CL')}</span>
                    <span className="text-lg text-gray-500 mb-1 font-medium">c/u</span>
                </div>

                {producto.descripcion && (
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        {producto.descripcion}
                    </p>
                )}

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8 space-y-6">
                    {/* Quantity Selector */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                            Cantidad a comprar
                        </label>
                        <p className="text-xs text-gray-500 mb-3">
                            Venta mínima desde {minQty} unidades {step > 1 ? `(se suma de ${step} en ${step})` : ''}
                        </p>
                        
                        <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 p-1 w-max">
                            <button 
                                onClick={() => setSelectedQty(Math.max(minQty, selectedQty - step))}
                                disabled={selectedQty <= minQty}
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>
                            
                            <input 
                                type="number" 
                                min={minQty}
                                step={step}
                                value={selectedQty}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val)) setSelectedQty(val);
                                }}
                                onBlur={(e) => {
                                    let val = parseInt(e.target.value);
                                    if (isNaN(val) || val < minQty) {
                                        val = minQty;
                                    } else if (step > 1) {
                                        val = Math.round(val / step) * step;
                                        if (val < minQty) val = minQty;
                                    }
                                    setSelectedQty(val);
                                }}
                                className="w-20 text-center text-xl font-bold text-gray-900 bg-transparent border-none p-0 focus:ring-0 focus:outline-none appearance-none"
                                style={{ MozAppearance: 'textfield' }}
                            />
                            
                            <button 
                                onClick={() => setSelectedQty(selectedQty + step)}
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600 font-medium">Subtotal:</span>
                            <span className="text-2xl font-bold text-gray-900">
                                ${(producto.precio_unitario * selectedQty).toLocaleString('es-CL')}
                            </span>
                        </div>
                        
                        <button 
                            onClick={handleAddToCart}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-primary-dark hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            Agregar al carrito
                        </button>
                    </div>
                </div>

                {/* Store Locator / Info */}
                <div className="mt-auto border-t border-gray-100 pt-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Información de Retiro
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-start gap-3">
                        <div className="mt-0.5">
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-800 font-medium">Local Principal</p>
                                <p className="text-sm text-gray-500">Mariano Casanova 336 local 02, Cartagena, Valparaíso.</p>
                                <p className="text-sm text-gray-500">Ventas, consumo en local y retiro.</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-800 font-medium">Solo Retiros</p>
                                <p className="text-sm text-gray-500">Caupolicán 1372, Cartagena, Valparaíso.</p>
                                <p className="text-sm text-gray-500">Solo retiro de pedidos.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { 
                    -webkit-appearance: none; 
                    margin: 0; 
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
