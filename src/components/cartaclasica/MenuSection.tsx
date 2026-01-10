
import React from 'react';
import MenuItem from './MenuItem';

interface Item {
    name: string;
    price: number;
    description?: string;
}

interface MenuSectionProps {
    name: string;
    items: Item[];
}

export default function MenuSection({ name, items }: MenuSectionProps) {
    return (
        <section className="menu-section">
            <h2>{name}</h2>
            <div className="divider"></div>

            {items.map((item, i) => (
                <MenuItem key={i} {...item} />
            ))}
        </section>
    );
}
