export interface Product {
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

export interface MenuGroup {
    id: string;
    label: string;
}
