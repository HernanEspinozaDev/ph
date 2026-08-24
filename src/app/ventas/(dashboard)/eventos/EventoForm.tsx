'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EventoProducto, createEventoProducto, updateEventoProducto, addEventoImagen, deleteEventoProducto, deleteEventoImagen } from '@/app/actions/eventos-admin';

export default function EventoForm({ initialData }: { initialData?: EventoProducto }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<{ url: string, isMain: boolean, id?: number }[]>(
        initialData?.imagenes?.map(img => ({ url: img.url, isMain: !!img.es_principal, id: img.id })) || []
    );
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        
        const data = {
            nombre: formData.get('nombre') as string,
            descripcion: formData.get('descripcion') as string,
            precio_unitario: parseInt(formData.get('precio_unitario') as string, 10),
            categoria: formData.get('categoria') as string,
            activo: formData.get('activo') === 'on' ? 1 : 0,
            cantidad_minima: parseInt(formData.get('cantidad_minima') as string, 10) || 1,
            incremento: parseInt(formData.get('incremento') as string, 10) || 1,
            opciones_rapidas: formData.get('opciones_rapidas') as string,
        };

        let productoId = initialData?.id;

        if (productoId) {
            await updateEventoProducto(productoId, data);
        } else {
            const result = await createEventoProducto(data);
            if (result.success && result.id) {
                productoId = result.id;
            } else {
                alert("Error al crear producto");
                setIsSubmitting(false);
                return;
            }
        }

        // Add new images
        const newImages = images.filter(img => !img.id);
        for (const img of newImages) {
            await addEventoImagen(productoId, img.url, img.isMain);
        }

        // Update principal flag for existing images if changed (Simplified: just setting the first one as principal if not explicitly handled)
        
        router.push('/ventas/eventos');
        router.refresh();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploadingImage(true);
        
        try {
            const formData = new FormData();
            formData.append('file', e.target.files[0]);
            formData.append('basePath', 'eventos');
            const cat = (document.getElementById('categoria') as HTMLSelectElement)?.value || 'varios';
            formData.append('categoryName', cat);
            const name = (document.getElementById('nombre') as HTMLInputElement)?.value || 'img';
            formData.append('productName', name);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setImages(prev => [...prev, { url: data.url, isMain: prev.length === 0 }]);
            } else {
                alert("Error subiendo imagen");
            }
        } catch (error) {
            console.error(error);
            alert("Error subiendo imagen");
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = async (index: number) => {
        const img = images[index];
        if (img.id) {
            if (confirm("¿Eliminar imagen de la base de datos?")) {
                await deleteEventoImagen(img.id);
            } else {
                return;
            }
        }
        const newImages = [...images];
        newImages.splice(index, 1);
        if (img.isMain && newImages.length > 0) {
            newImages[0].isMain = true;
        }
        setImages(newImages);
    };

    const handleDelete = async () => {
        if (!initialData?.id) return;
        if (confirm("¿Estás seguro de eliminar este producto por completo?")) {
            await deleteEventoProducto(initialData.id);
            router.push('/ventas/eventos');
            router.refresh();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                    <input id="nombre" name="nombre" type="text" required defaultValue={initialData?.nombre} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select id="categoria" name="categoria" defaultValue={initialData?.categoria || 'salado'} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                        <option value="salado">Catering Salado</option>
                        <option value="dulce">Catering Dulce</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea name="descripcion" rows={3} defaultValue={initialData?.descripcion || ''} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio Unitario ($)</label>
                    <input name="precio_unitario" type="number" required defaultValue={initialData?.precio_unitario} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h3 className="text-md font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Reglas de Cantidad</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Cantidad Mínima</label>
                            <input 
                                name="cantidad_minima" 
                                type="number" 
                                min="1" 
                                defaultValue={initialData?.cantidad_minima || 1} 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                            />
                            <p className="text-xs text-gray-500 mt-1">Ej: 100. El cliente no podrá comprar menos de este valor.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Se vende en múltiplos de</label>
                            <input 
                                name="incremento" 
                                type="number" 
                                min="1" 
                                defaultValue={initialData?.incremento || 1} 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                            />
                            <p className="text-xs text-gray-500 mt-1">Ej: 100. El selector saltará de 100 en 100 (100, 200, 300).</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Botones Rápidos (Opcional)</label>
                            <input 
                                name="opciones_rapidas" 
                                type="text" 
                                placeholder="Ej: 12,25,50,100"
                                defaultValue={initialData?.opciones_rapidas || ''} 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                            />
                            <p className="text-xs text-gray-500 mt-1">Números separados por coma. Crear botones de selección rápida encima del contador.</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 bg-gray-50 p-4 rounded-md border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Imágenes del Producto</label>
                    
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {images.map((img, idx) => (
                            <div key={idx} className={`relative flex-shrink-0 w-32 h-32 rounded-lg border-2 ${img.isMain ? 'border-blue-500' : 'border-gray-300'} overflow-hidden group`}>
                                <img src={img.url} className="w-full h-full object-cover" alt="preview" />
                                {img.isMain && <div className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] px-2 py-1 rounded-br-lg font-bold">Principal</div>}
                                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </button>
                                {!img.isMain && (
                                    <button type="button" onClick={() => {
                                        const newImg = [...images];
                                        newImg.forEach(i => i.isMain = false);
                                        newImg[idx].isMain = true;
                                        setImages(newImg);
                                    }} className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-xs py-1 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                                        Hacer Principal
                                    </button>
                                )}
                            </div>
                        ))}

                        <label className="flex-shrink-0 w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors">
                            {uploadingImage ? (
                                <span className="text-xs text-gray-500 animate-pulse">Subiendo...</span>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                    <span className="text-xs text-gray-500 font-medium">Añadir Foto</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                                </>
                            )}
                        </label>
                    </div>
                </div>

                <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                        <input type="checkbox" name="activo" defaultChecked={initialData ? initialData.activo === 1 : true} className="w-5 h-5 text-blue-600 rounded border-gray-300" />
                        <span className="ml-2 text-gray-700 font-medium">Producto Activo (Visible)</span>
                    </label>
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                {initialData ? (
                    <button type="button" onClick={handleDelete} className="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar Producto</button>
                ) : <div />}
                
                <div className="space-x-4">
                    <button type="button" onClick={() => router.push('/ventas/eventos')} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
                    <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                        {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
                    </button>
                </div>
            </div>
        </form>
    );
}
