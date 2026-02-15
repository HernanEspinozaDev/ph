'use server';

import { getRequestContext } from '@cloudflare/next-on-pages';
import { revalidatePath } from 'next/cache';

export async function toggleProductAvailability(id: number, disponible: boolean) {
    const { env } = getRequestContext();
    const db = env.DB;
    if (!db) return;

    await db.prepare('UPDATE productos SET disponible = ? WHERE id = ?')
        .bind(disponible ? 1 : 0, id)
        .run();

    revalidatePath('/ventas');
}

export async function toggleProductStockManagement(id: number, gestionarStock: boolean) {
    const { env } = getRequestContext();
    const db = env.DB;
    if (!db) return;

    await db.prepare('UPDATE productos SET gestionar_stock = ? WHERE id = ?')
        .bind(gestionarStock ? 1 : 0, id)
        .run();

    revalidatePath('/ventas');
}

export async function updateProductStock(id: number, stock: number) {
    const { env } = getRequestContext();
    const db = env.DB;
    if (!db) return;

    await db.prepare('UPDATE productos SET stock = ? WHERE id = ?')
        .bind(stock, id)
        .run();

    revalidatePath('/ventas');
}
