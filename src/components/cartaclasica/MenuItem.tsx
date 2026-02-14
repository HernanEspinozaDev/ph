
import React from 'react';
import Image from 'next/image';

interface MenuItemProps {
    name: string;
    ingredients?: string;
    price: number;
    imageUrl?: string | null;
    stock: number;
    gestionar_stock: number;
}

export default function MenuItem({ name, ingredients, price, imageUrl, stock, gestionar_stock }: MenuItemProps) {
    return (
        <div className="menu-item flex gap-4 items-start">
            {imageUrl && (
                <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-stone-100">
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline">
                    <h4 className="flex items-center gap-2">
                        {name}
                    </h4>
                    {/* Desktop Price */}
                    <span className="price hidden md:block">${price.toLocaleString('es-CL')}</span>
                </div>
                {ingredients && <p className="text-sm text-stone-500 mt-1">{ingredients}</p>}

                {/* Mobile Price */}
                <span className="price md:hidden block mt-2 text-right">${price.toLocaleString('es-CL')}</span>
            </div>
        </div>
    );
}
