export const navLinks = [
    {
        label: 'Pastelería Hijitos',
        dropdown: [
            { label: 'Nuestra Historia', href: '/about' },

            { label: 'Nuestras Ubicaciones', href: '/locations' },
            { label: 'Contacto', href: '/contact' },
        ],
    },
    { label: 'Menú', href: '/sucursal' },
    // { label: 'Tortas', href: '/tortas' },
    {
        label: 'Eventos y Catering',
        dropdown: [
            { label: 'Dulces', href: '/dulces' },
            { label: 'Salados', href: '/salados' },
        ],
    },

];

export const mobileNavLinks = navLinks; // Use same links for now
