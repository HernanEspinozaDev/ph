import React from 'react';
import MenuItem from './MenuItem';

interface Item {
    name: string;
    price: number;
    ingredients?: string;
    imageUrl?: string | null;
    stock: number;
    gestionar_stock: number;
}

interface MenuSectionProps {
    name: string;
    items: Item[];
}

export default function MenuSection({ name, items }: MenuSectionProps) {
    return (
        <section className="menu-section">
            <h2>{name}</h2>
            {items.map((item, i) => (
                <MenuItem key={i} {...item} />
            ))}
        </section>
    );
}
