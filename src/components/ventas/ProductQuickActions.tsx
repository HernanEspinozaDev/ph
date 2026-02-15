'use client';

import { toggleProductAvailability, toggleProductStockManagement, updateProductStock } from '@/app/actions/product-quick-actions';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import { useState, useEffect } from 'react';

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
    // We do not sync stock from props to local state to avoid "fighting" the server revalidation during rapid edits.
    // The user's local input is the source of truth while editing.

    const handleToggleDisponible = async (checked: boolean) => {
        setDisponible(checked); // Optimistic update
        await toggleProductAvailability(id, checked);
    };

    const handleToggleGestionarStock = async (checked: boolean) => {
        setGestionarStock(checked); // Optimistic
        await toggleProductStockManagement(id, checked);
    };

    const handleSaveStock = async () => {
        await updateProductStock(id, stock);
        // We rely on the server revalidation to eventually update 'initialStock' prop
        // but since we decoupled local state from props (commented out useEffect), 
        // the button will remain "dirty" until we perhaps force a sync or just leave it.
        // Better UX: update the "initial" reference for comparison so the button hides.
        // But we can't easily mutate props. 
        // Actually, revalidation WILL update the component with new props.
        // So we SHOULD re-enable the prop sync but ONLY if it matches our saved value?
        // Simplest for now: hide button on click by assuming success, or just rely on re-render.
        // Let's rely on Validated Path from server to re-render this component with new initialStock.
    };

    const isDirty = stock !== initialStock;

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

                        {isDirty && (
                            <button
                                onClick={handleSaveStock}
                                className="ml-2 bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all transform hover:scale-105 focus:outline-none"
                                title="Guardar cambios de stock"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
