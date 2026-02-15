'use client';

import { Category, createCategory, updateCategory } from '@/app/actions/categories';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import { useState } from 'react';

export default function CategoryManager({ categories }: { categories: Category[] }) {
    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className="space-y-8">
            {/* Create Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Nueva Categoría</h2>
                <form action={async (formData) => {
                    setIsCreating(true);
                    await createCategory(formData);
                    setIsCreating(false);
                    // Reset form is harder with server actions without JS, but form resets on navigation/revalidation usually if simpler
                    // We can use a ref to form if needed to reset, or just simple controlled input
                    const form = document.getElementById('create-cat-form') as HTMLFormElement;
                    form?.reset();
                }} id="create-cat-form" className="flex gap-4 items-end">
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input type="text" name="nombre" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="Ej: Tortas" />
                    </div>
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                    >
                        {isCreating ? 'Creando...' : 'Crear'}
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activa</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((cat) => (
                            <CategoryRow key={cat.id} category={cat} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function CategoryRow({ category }: { category: Category }) {
    const [order, setOrder] = useState(category.orden);
    const [active, setActive] = useState(category.activa === 1);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await updateCategory(category.id, active, order);
        setSaving(false);
    };

    const hasChanges = order !== category.orden || (active ? 1 : 0) !== category.activa;

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value))}
                    className="w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-1"
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {category.nombre}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <ToggleSwitch enabled={active} onChange={setActive} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {hasChanges && (
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md"
                    >
                        {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                )}
            </td>
        </tr>
    );
}
