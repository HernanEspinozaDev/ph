'use client';

import { toggleProductAvailability, toggleProductStockManagement, updateProductStock } from '@/app/actions/product-quick-actions';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

interface ProductQuickActionsProps {
    id: number;
    disponible: boolean;
    gestionarStock: boolean;
    stock: number;
}

export default function ProductQuickActions({ id, disponible: initialDisponible, gestionarStock: initialGestionarStock, stock: initialStock }: ProductQuickActionsProps) {
    const [disponible, setDisponible] = useState(initialDisponible);
    const [gestionarStock, setGestionarStock] = useState(initialGestionarStock);
    const [stock, setStock] = useState(initialStock);
    const [debouncedStock] = useDebounce(stock, 500);

    // Sync state if props change (though typically this component drives the change)
    useEffect(() => { setDisponible(initialDisponible); }, [initialDisponible]);
    useEffect(() => { setGestionarStock(initialGestionarStock); }, [initialGestionarStock]);
    useEffect(() => { setStock(initialStock); }, [initialStock]);

    const handleToggleDisponible = async (checked: boolean) => {
        setDisponible(checked); // Optimistic update
        await toggleProductAvailability(id, checked);
    };

    const handleToggleGestionarStock = async (checked: boolean) => {
        setGestionarStock(checked); // Optimistic
        await toggleProductStockManagement(id, checked);
    };

    // Effect to trigger server update when debounced stock changes
    useEffect(() => {
        if (debouncedStock !== initialStock) {
            updateProductStock(id, debouncedStock);
        }
    }, [debouncedStock, id, initialStock]);

    const incrementStock = () => setStock(s => s + 1);
    const decrementStock = () => setStock(s => Math.max(0, s - 1));

    return (
        <div className="flex flex-col space-y-3 w-full">
            {/* Disponible Row */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase font-semibold">Disponible</span>
                <ToggleSwitch enabled={disponible} onChange={handleToggleDisponible} srLabel="Alternar disponibilidad" />
            </div>

            {/* Stock Row */}
            <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Stock</span>
                    <ToggleSwitch enabled={gestionarStock} onChange={handleToggleGestionarStock} srLabel="Alternar control de stock" />
                </div>

                {gestionarStock && (
                    <div className="flex items-center justify-end space-x-2 mt-1 animate-fadeIn">
                        <button
                            onClick={decrementStock}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center font-bold focus:outline-none"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-center border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            onClick={incrementStock}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center font-bold focus:outline-none"
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
