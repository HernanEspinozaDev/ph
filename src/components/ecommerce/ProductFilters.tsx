interface ProductFiltersProps {
    priceRange: { min: number, max: number };
    onPriceChange: (range: { min: number, max: number }) => void;
    maxAvailablePrice: number;
    onReset: () => void;
}

export default function ProductFilters({ priceRange, onPriceChange, maxAvailablePrice, onReset }: ProductFiltersProps) {
    return (
        <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Filtros</h2>
                    <button 
                        onClick={onReset}
                        className="text-sm text-primary hover:underline"
                    >
                        Limpiar
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Price Filter */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Rango de Precio</h3>
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <div className="flex-1 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                <input 
                                    type="number" 
                                    min="0"
                                    value={priceRange.min}
                                    onChange={(e) => onPriceChange({ ...priceRange, min: Number(e.target.value) })}
                                    className="w-full pl-7 pr-2 py-1.5 text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <span className="text-gray-400">-</span>
                            <div className="flex-1 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                <input 
                                    type="number" 
                                    min="0"
                                    max={maxAvailablePrice}
                                    value={priceRange.max}
                                    onChange={(e) => onPriceChange({ ...priceRange, max: Number(e.target.value) })}
                                    className="w-full pl-7 pr-2 py-1.5 text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max={maxAvailablePrice}
                            value={priceRange.max}
                            onChange={(e) => onPriceChange({ ...priceRange, max: Number(e.target.value) })}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>$0</span>
                            <span>${maxAvailablePrice.toLocaleString('es-CL')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
