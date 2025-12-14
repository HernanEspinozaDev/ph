
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { CATEGORIES, MENU_ITEMS, MenuItem, MenuGroup, MenuCategory } from '@/lib/menuData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { Search, X, ChefHat, Clock, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';


// Helper for currency
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
    }).format(price);
};

// Groups
const GROUPS: { id: MenuGroup; label: string }[] = [
    { id: 'promociones', label: 'Promociones' },
    { id: 'menu-deldia', label: 'Menú del Día' },
    { id: 'salados', label: 'Salados' },
    { id: 'dulces', label: 'Dulces' },
    { id: 'cafeteria', label: 'Cafetería' },
    { id: 'helados', label: 'Helados' },
    { id: 'bebidas', label: 'Bebidas' },
];

export default function MenuPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
    const [activeGroup, setActiveGroup] = useState<MenuGroup | string>('promociones');

    // Simple scroll spy logic
    useEffect(() => {
        const handleScroll = () => {
            const sections = GROUPS.map(g => document.getElementById(g.id));
            const scrollPosition = window.scrollY + 150; // Offset

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveGroup(GROUPS[i].id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            window.scrollTo({
                top: section.offsetTop - 100, // Header offset
                behavior: 'smooth',
            });
            setActiveGroup(id);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans">

            {/* --- DESKTOP SIDEBAR --- */}
            <div className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-stone-200 z-50">
                <div className="p-6 flex justify-center border-b border-stone-100">
                    <div className="relative w-32 h-20">
                        <Image
                            src="/logo.webp"
                            alt="Logo Hijitos"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <p className="px-4 text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Carta</p>
                    {GROUPS.map((group) => (
                        <button
                            key={group.id}
                            onClick={() => scrollToSection(group.id)}
                            className={cn(
                                "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                activeGroup === group.id
                                    ? "bg-amber-100 text-amber-900 border-l-4 border-amber-500"
                                    : "text-stone-600 hover:bg-stone-50"
                            )}
                        >
                            {group.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-stone-100 text-xs text-center text-stone-400">
                    © 2024 Pastelería Hijitos
                </div>
            </div>

            {/* --- MOBILE NAVBAR --- */}
            <div className="lg:hidden sticky top-0 z-50 bg-white shadow-sm">
                {/* Top Logo */}
                <div className="flex justify-center py-3 border-b border-stone-100">
                    <div className="relative w-40 h-24">
                        <Image
                            src="/logo.webp"
                            alt="Logo Hijitos"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
                {/* Scrollable Nav */}
                <div className="flex overflow-x-auto whitespace-nowrap bg-white px-4 py-3 scrollbar-hide gap-3 border-b border-stone-200">
                    {GROUPS.map((group) => (
                        <button
                            key={group.id}
                            onClick={() => scrollToSection(group.id)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                                activeGroup === group.id
                                    ? "bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200"
                                    : "bg-white border-stone-200 text-stone-600"
                            )}
                        >
                            {group.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="lg:pl-64">
                {/* Search Bar - Global */}
                <div className="sticky top-[105px] lg:top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-sm p-4 border-b border-stone-200/50">
                    <div className="relative max-w-2xl mx-auto lg:mx-0">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                        <Input
                            placeholder="Buscar en la carta (ej. Churrasco Italiano)..."
                            className="pl-10 bg-white border-stone-200 rounded-lg shadow-sm focus:border-amber-500 focus:ring-amber-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-4 lg:p-8 space-y-12 max-w-5xl">
                    {GROUPS.map((group) => {
                        // Filter Items by Group
                        const groupCategories = CATEGORIES.filter(c => c.group === group.id).map(c => c.id);
                        const items = MENU_ITEMS.filter(item =>
                            groupCategories.includes(item.categoryId) &&
                            (searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        );

                        if (items.length === 0) return null;

                        return (
                            <section key={group.id} id={group.id} className="scroll-mt-32 lg:scroll-mt-24">
                                <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                                    {group.id === 'promociones' && <span className="text-2xl">🔥</span>}
                                    {group.label}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setSelectedProduct(item)}
                                            className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md border border-stone-100 flex gap-4 cursor-pointer transition-all hover:border-amber-300 group h-full"
                                        >
                                            {/* Image Left */}
                                            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-stone-100">
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                {/* Status Badge */}
                                                {item.stock === 0 && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold uppercase">Agotado</span>
                                                    </div>
                                                )}
                                                {((item.stock !== undefined && item.stock > 0 && item.stock < 5) || (item.isAvailable === false)) && (
                                                    <span className="absolute bottom-1 right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                                                        Pocos
                                                    </span>
                                                )}
                                            </div>

                                            {/* Content Right */}
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start gap-2">
                                                        <h3 className="font-bold text-stone-800 line-clamp-2 leading-tight group-hover:text-amber-600 transition-colors">
                                                            {item.name}
                                                        </h3>
                                                        <span className="font-bold text-amber-600 text-lg whitespace-nowrap">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-stone-500 mt-1 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                <div className="flex gap-2 mt-2">
                                                    {item.badges?.map(badge => (
                                                        <span key={badge} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                                            {badge}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )
                    })}

                    {/* Not found state */}
                    {searchQuery && MENU_ITEMS.every(item => !item.name.toLowerCase().includes(searchQuery.toLowerCase())) && (
                        <div className="text-center py-20">
                            <p className="text-stone-400">No encontramos productos con "{searchQuery}"</p>
                            <Button variant="link" onClick={() => setSearchQuery('')}>Limpiar búsqueda</Button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL --- */}
            <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
                <DialogContent className="sm:max-w-md w-[95vw] p-0 overflow-hidden bg-white text-stone-800">
                    <DialogTitle className="sr-only">
                        {selectedProduct ? selectedProduct.name : 'Detalle del producto'}
                    </DialogTitle>
                    {selectedProduct && (
                        <>
                            <div className="relative h-64 w-full">
                                <Image
                                    src={selectedProduct.imageUrl}
                                    alt={selectedProduct.name}
                                    fill
                                    className="object-cover"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-3 top-3 bg-black/20 text-white hover:bg-black/40 rounded-full backdrop-blur-sm"
                                    onClick={() => setSelectedProduct(null)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>

                                <div className="absolute bottom-4 left-6">
                                    <h2 className="text-2xl font-bold text-white shadow-black/50 drop-shadow-md">{selectedProduct.name}</h2>
                                    <p className="font-bold text-amber-400 text-xl drop-shadow-md">{formatPrice(selectedProduct.price)}</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <p className="text-stone-600 leading-relaxed">
                                    {selectedProduct.description}
                                </p>

                                {/* Stock/Availability in Modal */}
                                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-100">
                                    {selectedProduct.stock !== undefined ? (
                                        <>
                                            <Clock className={cn("h-5 w-5", selectedProduct.stock === 0 ? "text-red-500" : "text-amber-500")} />
                                            <div>
                                                <p className="text-xs text-stone-500 font-bold uppercase">Disponibilidad</p>
                                                <p className={cn("text-sm font-medium", selectedProduct.stock === 0 ? "text-red-600" : "text-stone-800")}>
                                                    {selectedProduct.stock === 0 ? "Agotado temporalmente" : `Quedan ${selectedProduct.stock} unidades`}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <ChefHat className="h-5 w-5 text-emerald-500" />
                                            <div>
                                                <p className="text-xs text-stone-500 font-bold uppercase">Cocina</p>
                                                <p className="text-sm font-medium text-stone-800">Preparado al momento</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {selectedProduct.ingredients.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-stone-400 uppercase mb-2">Ingredientes</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProduct.ingredients.map((ing) => (
                                                <span key={ing} className="px-2 py-1 rounded-md bg-stone-100 text-stone-600 text-xs font-medium">
                                                    {ing}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-12 rounded-lg text-lg shadow-lg shadow-amber-200 mt-2">
                                    ¡Lo quiero!
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
