
import React from 'react';

interface MenuItemProps {
    name: string;
    description?: string;
    price: number;
}

export default function MenuItem({ name, description, price }: MenuItemProps) {
    return (
        <div className="menu-item">
            <div>
                <h4>{name}</h4>
                {description && <p>{description}</p>}
            </div>
            <span className="price">${price.toLocaleString('es-CL')}</span>
        </div>
    );
}
