
import menuData from '@/data/menu.json';

export type MenuGroup = 'promociones' | 'menu-deldia' | 'dulces' | 'salados' | 'bebidas' | 'cafeteria' | 'helados';

export interface MenuCategory {
    id: string;
    name: string;
    slug: string;
    group: MenuGroup;
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    imageUrl: string;
    badges?: string[];
    ingredients: string[];
    // Logic for availability
    stock?: number;
    isAvailable?: boolean;
}

export const MENU_GROUPS: { id: MenuGroup; label: string }[] = [
    { id: 'promociones', label: 'Promociones' },
    { id: 'menu-deldia', label: 'Menú del Día' },
    { id: 'salados', label: 'Salados' },
    { id: 'dulces', label: 'Dulces' },
    { id: 'cafeteria', label: 'Cafetería' },
    { id: 'helados', label: 'Helados' },
    { id: 'bebidas', label: 'Bebidas' },
];

export const CATEGORIES: MenuCategory[] = menuData.categories as MenuCategory[];
export const MENU_ITEMS: MenuItem[] = menuData.items as MenuItem[];
