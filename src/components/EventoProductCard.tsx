'use client';

import { useState } from 'react';
import { EventoProducto } from '@/app/actions/eventos-admin';
import { useCotizadorStore } from '@/hooks/useCotizadorStore';

export default function EventoProductCard({ producto }: { producto: EventoProducto }) {
    const [mainImageIdx, setMainImageIdx] = useState(0);
    const minQty = producto.cantidad_minima || 1;
    const step = producto.incremento || 1;
    const opcionesRapidas = producto.opciones_rapidas 
        ? producto.opciones_rapidas.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
        : [];

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

        alert('¡Agregado al carrito de cotización!');
    };

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-purple-100/50 overflow-hidden flex flex-col h-full animate-fade-in-up relative">
            
            {/* Image Gallery */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                <img 
                    src={mainImgUrl} 
                    alt={producto.nombre} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-primary shadow-sm">
                    {producto.categoria}
                </div>
            </div>
            
            {/* Thumbnails */}
            {imagenes.length > 1 && (
                <div className="flex gap-2 p-3 bg-white overflow-x-auto hide-scrollbar border-b border-gray-50">
                    {imagenes.map((img, idx) => (
                        <button 
                            key={img.id} 
                            onClick={() => setMainImageIdx(idx)}
                            className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all duration-300 ${
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

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow bg-white">
                <h3 className="text-2xl font-headline font-bold text-gray-800 mb-2 leading-tight group-hover:text-primary transition-colors">
                    {producto.nombre}
                </h3>
                
                {producto.descripcion && (
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                        {producto.descripcion}
                    </p>
                )}
                
                <div className="mt-auto">
                    {/* Price */}
                    <div className="flex items-end gap-1 mb-4">
                        <span className="text-3xl font-bold text-gray-900">${producto.precio_unitario.toLocaleString('es-CL')}</span>
                        <span className="text-sm text-gray-500 mb-1.5 ml-1 font-medium">c/u</span>
                    </div>

                    {/* Quantity Rules Badge */}
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-6">
                        <p className="text-sm text-primary/80 font-medium flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Desde {minQty} u. {step > 1 ? `(en múltiplos de ${step})` : ''}
                        </p>
                    </div>

                    {/* Quick Options */}
                    {opcionesRapidas.length > 0 && (
                        <div className="mb-6">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Opciones Rápidas</p>
                            <div className="flex flex-wrap gap-2">
                                {opcionesRapidas.map(opcion => (
                                    <button 
                                        key={opcion}
                                        onClick={() => setSelectedQty(Math.max(minQty, opcion))}
                                        className={`px-4 py-2 text-sm rounded-full font-semibold transition-all duration-300 ${
                                            selectedQty === opcion 
                                            ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' 
                                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                        }`}
                                    >
                                        {opcion} u.
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mb-6 p-1 pl-4 bg-gray-50 rounded-full border border-gray-100">
                        <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Cantidad</span>
                        <div className="flex items-center bg-white rounded-full shadow-sm border border-gray-100 p-0.5">
                            <button 
                                onClick={() => setSelectedQty(Math.max(minQty, selectedQty - step))}
                                disabled={selectedQty <= minQty}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                className="w-16 text-center font-bold text-gray-800 bg-transparent border-none p-0 focus:ring-0 focus:outline-none appearance-none"
                                style={{ MozAppearance: 'textfield' }}
                            />
                            
                            <button 
                                onClick={() => setSelectedQty(selectedQty + step)}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/5 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                        onClick={handleAddToCart}
                        className="w-full relative overflow-hidden group/btn bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            Agregar a Cotización 
                            <span className="w-1 h-1 rounded-full bg-white/50"></span>
                            <span className="text-white/90 font-medium">
                                ${(producto.precio_unitario * selectedQty).toLocaleString('es-CL')}
                            </span>
                        </span>
                        <div className="absolute inset-0 h-full w-0 bg-primary transition-all duration-300 ease-out group-hover/btn:w-full"></div>
                    </button>
                </div>
            </div>
            
            {/* Custom CSS to hide number input arrows globally within this component */}
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
