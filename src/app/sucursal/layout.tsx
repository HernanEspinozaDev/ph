import React from 'react';

export default function SucursalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="font-classic">{children}</div>;
}
