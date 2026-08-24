'use server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { revalidatePath } from 'next/cache';

export interface EventoImagen {
  id: number;
  producto_id: number;
  url: string;
  es_principal: number;
  orden: number;
}

export interface EventoProducto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_unitario: number;
  categoria: string;
  activo: number;
  permite_12?: number; // legacy
  permite_25?: number; // legacy
  permite_100?: number; // legacy
  cantidad_minima: number;
  incremento: number;
  opciones_rapidas: string;
  imagenes?: EventoImagen[];
}

export async function getEventoProductos(): Promise<EventoProducto[]> {
  try {
    const { env } = getRequestContext();
    if (!env.DB) return [];

    const query = `SELECT * FROM evento_productos ORDER BY id DESC`;
    const { results } = await env.DB.prepare(query).all<EventoProducto>();

    // Fetch images for each product
    if (results && results.length > 0) {
      const imgQuery = `SELECT * FROM evento_imagenes ORDER BY orden ASC, es_principal DESC`;
      const { results: images } = await env.DB.prepare(imgQuery).all<EventoImagen>();
      
      const imagesByProduct = images.reduce((acc, img) => {
        if (!acc[img.producto_id]) acc[img.producto_id] = [];
        acc[img.producto_id].push(img);
        return acc;
      }, {} as Record<number, EventoImagen[]>);

      return results.map(product => ({
        ...product,
        imagenes: imagesByProduct[product.id] || []
      }));
    }
    
    return results || [];
  } catch (error) {
    console.error("Error fetching evento productos:", error);
    return [];
  }
}

export async function createEventoProducto(data: Omit<EventoProducto, 'id' | 'imagenes'>): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const { env } = getRequestContext();
    if (!env.DB) throw new Error("DB not found");

    const query = `
      INSERT INTO evento_productos (nombre, descripcion, precio_unitario, categoria, activo, cantidad_minima, incremento, opciones_rapidas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `;
    const result = await env.DB.prepare(query).bind(
      data.nombre,
      data.descripcion || null,
      data.precio_unitario,
      data.categoria,
      data.activo ? 1 : 0,
      data.cantidad_minima || 1,
      data.incremento || 1,
      data.opciones_rapidas || ''
    ).first<{ id: number }>();

    revalidatePath('/ventas/eventos');
    return { success: true, id: result?.id };
  } catch (error: any) {
    console.error("Error creating evento producto:", error);
    return { success: false, error: error.message };
  }
}

export async function updateEventoProducto(id: number, data: Omit<EventoProducto, 'id' | 'imagenes'>): Promise<{ success: boolean; error?: string }> {
  try {
    const { env } = getRequestContext();
    if (!env.DB) throw new Error("DB not found");

    const query = `
      UPDATE evento_productos 
      SET nombre = ?, descripcion = ?, precio_unitario = ?, categoria = ?, activo = ?, cantidad_minima = ?, incremento = ?, opciones_rapidas = ?
      WHERE id = ?
    `;
    await env.DB.prepare(query).bind(
      data.nombre,
      data.descripcion || null,
      data.precio_unitario,
      data.categoria,
      data.activo ? 1 : 0,
      data.cantidad_minima || 1,
      data.incremento || 1,
      data.opciones_rapidas || '',
      id
    ).run();

    revalidatePath('/ventas/eventos');
    return { success: true };
  } catch (error: any) {
    console.error("Error updating evento producto:", error);
    return { success: false, error: error.message };
  }
}

export async function addEventoImagen(producto_id: number, url: string, es_principal: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const { env } = getRequestContext();
    if (!env.DB) throw new Error("DB not found");

    // If making this principal, unset others first (optional, could be handled in UI logic, but good here)
    if (es_principal) {
        await env.DB.prepare(`UPDATE evento_imagenes SET es_principal = 0 WHERE producto_id = ?`).bind(producto_id).run();
    }

    const query = `INSERT INTO evento_imagenes (producto_id, url, es_principal, orden) VALUES (?, ?, ?, ?)`;
    await env.DB.prepare(query).bind(
      producto_id,
      url,
      es_principal ? 1 : 0,
      0
    ).run();

    revalidatePath('/ventas/eventos');
    return { success: true };
  } catch (error: any) {
    console.error("Error adding evento imagen:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteEventoImagen(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const { env } = getRequestContext();
    if (!env.DB) throw new Error("DB not found");

    await env.DB.prepare(`DELETE FROM evento_imagenes WHERE id = ?`).bind(id).run();

    revalidatePath('/ventas/eventos');
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting evento imagen:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteEventoProducto(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const { env } = getRequestContext();
    if (!env.DB) throw new Error("DB not found");

    // Images will be deleted by CASCADE if supported, otherwise manually:
    await env.DB.prepare(`DELETE FROM evento_imagenes WHERE producto_id = ?`).bind(id).run();
    await env.DB.prepare(`DELETE FROM evento_productos WHERE id = ?`).bind(id).run();

    revalidatePath('/ventas/eventos');
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting evento producto:", error);
    return { success: false, error: error.message };
  }
}

export async function getEventoProducto(id: number): Promise<EventoProducto | null> {
  try {
    const { env } = getRequestContext();
    if (!env.DB) return null;

    const query = `SELECT * FROM evento_productos WHERE id = ?`;
    const product = await env.DB.prepare(query).bind(id).first<EventoProducto>();

    if (product) {
      const imgQuery = `SELECT * FROM evento_imagenes WHERE producto_id = ? ORDER BY orden ASC, es_principal DESC`;
      const { results: images } = await env.DB.prepare(imgQuery).bind(id).all<EventoImagen>();
      product.imagenes = images || [];
      return product;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching evento producto ${id}:`, error);
    return null;
  }
}
