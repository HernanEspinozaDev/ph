'use server';
import { getRequestContext } from '@cloudflare/next-on-pages';




export interface Product {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio: number;
    categoria: string; // Kept for compatibility, but populated from joined table
    categoria_id: number;
    imagen_url: string | null;
    disponible: number;
    stock: number;
    gestionar_stock: number;
    ingredientes: string | null;
}

export async function getMenu(): Promise<Product[]> {
    const query = `
        SELECT 
            p.*, 
            c.nombre as categoria 
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.disponible = 1 
        AND (p.gestionar_stock = 0 OR p.stock > 0)
        ORDER BY c.orden, p.nombre
    `;

    try {
        // Use getRequestContext to retrieve the binding
        const { env } = getRequestContext();
        const db = env.DB;

        if (!db) {
            console.error("DB binding not found on getRequestContext().env");
            return [];
        }

        const { results } = await db.prepare(query).all<Product>();
        return results;
    } catch (e) {
        console.error("Error in getMenu:", e);
        // Fallback for non-edge runtime if accidentally called there?
        const db = (process.env as any).DB as D1Database;
        if (db) {
            const { results } = await db.prepare(query).all<Product>();
            return results;
        }
        return [];
    }
}
