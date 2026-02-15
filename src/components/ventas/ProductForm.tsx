'use client';

import { AdminProduct } from '@/app/actions/admin-products';
import { Category } from '@/app/actions/categories';
import { updateProduct } from '@/app/actions/products-update';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import { useState } from 'react';
import Link from 'next/link';
import imageCompression from 'browser-image-compression';

export default function ProductForm({ product, categories }: { product: AdminProduct, categories: Category[] }) {
    const [disponible, setDisponible] = useState(product.disponible === 1);
    const [gestionarStock, setGestionarStock] = useState(product.gestionar_stock === 1);
    const [imageUrl, setImageUrl] = useState(product.imagen_url || '');
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1280,
                useWebWorker: true,
                fileType: 'image/webp'
            };

            const compressedFile = await imageCompression(file, options);

            // Get selected category name for folder
            // We use the ID to find the name from props
            const select = document.querySelector('select[name="categoria_id"]') as unknown as HTMLSelectElement;
            const categoryId = parseInt(select?.value || String(product.categoria_id));
            const categoryName = categories.find(c => c.id === categoryId)?.nombre || 'uncategorized';

            const formData = new FormData();
            formData.append('file', compressedFile);
            formData.append('categoryName', categoryName);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json() as { url: string };
            setImageUrl(data.url);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error al subir la imagen. Inténtalo de nuevo.');
        } finally {
            setUploadingImage(false);
        }
    };

    // We wrapper the action to handle loading state
    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        // Add switch values manually if needed, but <input type="hidden"> inside conditional rendering works too.
        // However, standard form submission might confirm if unchecked checkboxes send nothing.
        // Let's use hidden inputs controlled by state for robust handling.
        await updateProduct(product.id, formData);
        // No need to set loading false as it redirects.
    };

    return (
        <form action={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-800">{isNew ? 'Nuevo Producto' : 'Editar Producto'}</h2>
                <Link href="/ventas" className="text-gray-500 hover:text-gray-700">Cancelar</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input type="text" name="nombre" defaultValue={product.nombre} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>

                {/* Precio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Precio</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input type="number" name="precio" defaultValue={product.precio} required className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                </div>

                {/* Categoría */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Categoría</label>
                    <select name="categoria_id" defaultValue={product.categoria_id} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Descripción */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea name="descripcion" defaultValue={product.descripcion || ''} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>

                {/* Ingredientes */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Ingredientes</label>
                    <textarea name="ingredientes" defaultValue={product.ingredientes || ''} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>

                {/* Switches & Stock */}
                <div className="bg-gray-50 p-4 rounded-md col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="block text-sm font-medium text-gray-700">Disponible</span>
                            <span className="text-xs text-gray-500">¿El producto está visible para los clientes?</span>
                        </div>
                        <div className="flex items-center">
                            <ToggleSwitch enabled={disponible} onChange={setDisponible} />
                            <input type="hidden" name="disponible" value={disponible ? 'on' : 'off'} />
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <span className="block text-sm font-medium text-gray-700">Gestionar Stock</span>
                            <span className="text-xs text-gray-500">¿Controlar cantidad exacta?</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <ToggleSwitch enabled={gestionarStock} onChange={setGestionarStock} />
                            <input type="hidden" name="gestionar_stock" value={gestionarStock ? 'on' : 'off'} />

                            {/* Stock Input appears only if enabled */}
                            {gestionarStock && (
                                <div className="flex items-center">
                                    <label className="mr-2 text-sm text-gray-600">Cant:</label>
                                    <input type="number" name="stock" defaultValue={product.stock} className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-1" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Imagen Upload */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
                    <div className="mt-1 flex items-center space-x-4">
                        <div className="flex-shrink-0 h-32 w-32 bg-gray-100 rounded-lg border border-gray-300 overflow-hidden flex items-center justify-center relative">
                            {imageUrl ? (
                                <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-gray-400 text-xs text-center p-2">Sin imagen</span>
                            )}
                            {uploadingImage && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>
                        <div className="flex-grow">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={uploadingImage}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                La imagen se convertirá automáticamente a WebP y se optimizará antes de subir.
                            </p>
                            <input type="hidden" name="imagen_url" value={imageUrl} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading || uploadingImage}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : (uploadingImage ? 'Subiendo Imagen...' : 'Guardar Cambios')}
                </button>
            </div>
        </form>
    );
}
