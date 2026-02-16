'use server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export interface Category {
    id: number;
    nombre: string;
    orden: number;
    activa: number;
}

export async function getCategories(): Promise<Category[]> {
    try {
        const { env } = getRequestContext();
        const db = env.DB;
        if (!db) return [];

        const { results } = await db.prepare('SELECT * FROM categorias ORDER BY orden ASC').all<Category>();
        return results;
    } catch (e) {
        console.error("Error fetching categories:", e);
        return [];
    }
}

import { revalidatePath } from 'next/cache';

export async function createCategory(formData: FormData) {
    const { env } = getRequestContext();
    const db = env.DB;
    if (!db) return;

    const nombre = formData.get('nombre') as string;

    // Get max order + 1
    const { results } = await db.prepare('SELECT MAX(orden) as maxOrd FROM categorias').all<{ maxOrd: number }>();
    const newOrder = (results[0]?.maxOrd || 0) + 1;

    await db.prepare('INSERT INTO categorias (nombre, orden, activa) VALUES (?, ?, 1)')
        .bind(nombre, newOrder)
        .run();

    revalidatePath('/ventas/categorias');
    revalidatePath('/ventas'); // Update product list filters/labels potentially
    return { success: true };
}

export async function updateCategory(id: number, active: boolean, order: number) {
    const { env } = getRequestContext();
    const db = env.DB;
    if (!db) return;

    await db.prepare('UPDATE categorias SET activa = ?, orden = ? WHERE id = ?')
        .bind(active ? 1 : 0, order, id)
        .run();

    revalidatePath('/ventas/categorias');
    revalidatePath('/ventas');
}
