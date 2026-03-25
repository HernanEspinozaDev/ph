import React from 'react';

interface MenuItemProps {
    name: string;
    ingredients?: string;
    price: number;
    imageUrl?: string | null;
    stock: number;
    gestionar_stock: number;
}

export default function MenuItem({ name, ingredients, price }: MenuItemProps) {
    return (
        <div className="menu-item">
            <div className="menu-item-header">
                <span className="menu-item-name">{name}</span>
                <span className="menu-item-dots"></span>
                <span className="menu-item-price">${price.toLocaleString('es-CL')}</span>
            </div>
            {ingredients && <p className="menu-item-desc">{ingredients}</p>}
        </div>
    );
}
