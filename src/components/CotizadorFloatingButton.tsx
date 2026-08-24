'use client';

import { useCotizadorStore } from '@/hooks/useCotizadorStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';

export default function CotizadorFloatingButton() {
    const [mounted, setMounted] = useState(false);
    const itemCount = useCotizadorStore(state => state.getItemCount());

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || itemCount === 0) return null;

    return (
        <Link href="/cotizador" className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-3">
            <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                    {itemCount}
                </span>
            </div>
            <span className="font-semibold hidden sm:inline">Ver Cotización</span>
        </Link>
    );
}
