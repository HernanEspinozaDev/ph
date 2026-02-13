
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
                <div className="flex justify-between items-baseline">
                    <h4 className="flex items-center gap-2">
                        {name}
                        {gestionar_stock === 1 && (
                            <span className={`text-[10px] font-normal px-1.5 py-0.5 rounded-full border ${stock > 0 ? 'border-green-200 text-green-700 bg-green-50' : 'border-red-200 text-red-700 bg-red-50'}`}>
                                {stock > 0 ? `${stock} disp.` : 'Agotado'}
                            </span>
                        )}
                    </h4>
                    <span className="price">${price.toLocaleString('es-CL')}</span>
                </div>
                {ingredients && <p className="text-sm text-stone-500 mt-1">{ingredients}</p>}
            </div>
        </div>
    );
}
