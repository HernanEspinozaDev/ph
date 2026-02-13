import { getMenu } from '@/app/actions/menu';
import MenuClient from './MenuClient';
import { MenuGroup } from '@/types/menu';

export const runtime = 'edge';

export default async function MenuPage() {
    const products = await getMenu();

    // Dynamically extract categories from products
    const uniqueCategories = Array.from(new Set(products.map(p => p.categoria))).filter(Boolean);

    // Create groups from categories
    // Map D1 categories to friendly labels/IDs
    const groups: MenuGroup[] = uniqueCategories.map(cat => ({
        id: cat, // Use category name as ID for simplicity
        label: cat
    }));

    // Optional: Sort groups if needed (e.g. Pizzas first, Bebidas last)
    // For now we trust the DB order or let them append.

    return <MenuClient products={products} groups={groups} />;
}
