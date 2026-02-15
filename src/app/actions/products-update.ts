'use server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { AdminProduct } from './admin-products';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getProductById(id: number): Promise<AdminProduct | null> {
    try {
        const { env } = getRequestContext();
        const db = env.DB;
        if (!db) return null;

        // Ensure we get the category name just in case, though for edit form we mostly need raw values.
        // But the previous query joined, so let's be consistent.
        const query = `
            SELECT 
                p.*, 
                c.nombre as categoria 
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE p.id = ?
        `;

        const { results } = await db.prepare(query).bind(id).all<AdminProduct>();
        return results[0] || null;
    } catch (e) {
        console.error("Error fetching product by id:", e);
        return null;
    }
}

export async function updateProduct(id: number, formData: FormData) {
    const { env } = getRequestContext();
    const db = env.DB;
    if (!db) throw new Error("Database not available");

    const nombre = formData.get('nombre') as string;
    const descripcion = formData.get('descripcion') as string;
    const precio = parseInt(formData.get('precio') as string);
    const categoria_id = parseInt(formData.get('categoria_id') as string);
    const ingredientes = formData.get('ingredientes') as string;
    const disponible = formData.get('disponible') === 'on' ? 1 : 0;
    const gestionar_stock = formData.get('gestionar_stock') === 'on' ? 1 : 0;
    const stock = parseInt(formData.get('stock') as string) || 0;
    const imagen_url = formData.get('imagen_url') as string; // Readonly for now

    try {
        await db.prepare(`
            UPDATE productos SET 
                nombre = ?, 
                descripcion = ?, 
                precio = ?, 
                categoria_id = ?, 
                ingredientes = ?, 
                disponible = ?, 
                gestionar_stock = ?, 
                stock = ?,
                imagen_url = ?
            WHERE id = ?
        `).bind(
            nombre,
            descripcion,
            precio,
            categoria_id,
            ingredientes,
            disponible,
            gestionar_stock,
            stock,
            imagen_url,
            id
        ).run();
    } catch (e) {
        console.error("Error updating product:", e);
        throw new Error("Failed to update product");
    }

    revalidatePath('/ventas');
    revalidatePath(`/ventas/producto/${id}`);
    redirect('/ventas');
}
