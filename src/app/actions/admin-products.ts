'use server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export interface AdminProduct {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio: number;
    categoria: string;
    categoria_id: number;
    imagen_url: string | null;
    disponible: number;
    stock: number;
    gestionar_stock: number;
    ingredientes: string | null;
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
    try {
        const { env } = getRequestContext();
        const db = env.DB;

        if (!db) return [];

        // Join with categories to get category name
        const query = `
            SELECT 
                p.*, 
                c.nombre as categoria 
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            ORDER BY p.id DESC
        `;

        const { results } = await db.prepare(query).all<AdminProduct>();
        return results;
    } catch (e) {
        console.error("Error fetching admin products:", e);
        return [];
    }
}
