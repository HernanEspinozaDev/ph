
import Image from 'next/image';
import { CATEGORIES, MENU_ITEMS, MENU_GROUPS } from '@/lib/menuData'; // Use unified data
import MenuSection from "@/components/cartaclasica/MenuSection";
import "@/styles/menu.css";

// Reusing GROUPS from Carta Digital Page or defining them here as they are visual organization
const GROUPS = MENU_GROUPS;

export default function CartaClasicaPage() {
    // We need to transform the flat items list into the nested structure MenuSection expects
    // or simply iterate freely. Carta Clasica renders sections.

    // Helper to build sections based on Groups
    const sections = GROUPS.map(group => {
        // Find categories in this group
        const groupCategories = CATEGORIES.filter(c => c.group === group.id);
        const groupCategoryIds = groupCategories.map(c => c.id);

        // Find items in these categories
        const groupItems = MENU_ITEMS.filter(item => groupCategoryIds.includes(item.categoryId));

        return {
            name: group.label.toUpperCase(),
            items: groupItems.map(item => ({
                name: item.name,
                price: item.price,
                description: item.description // Include description if available
            }))
        };
    }).filter(section => section.items.length > 0); // Only show sections with items


    return (
        <div className="min-h-screen bg-[#1c1c1c] text-white">
            <div className="menu-container">
                <header className="menu-header">
                    <div className="relative w-40 h-24 mx-auto mb-4">
                        <Image
                            src="/logo.webp"
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h1>Pastelería Hijitos</h1>
                    <div className="subtitle">Menú</div>
                </header>

                {sections.map((section, index) => (
                    <MenuSection key={index} {...section} />
                ))}
            </div>
        </div>
    );
}
