
export type MenuGroup = 'promociones' | 'menu-deldia' | 'dulces' | 'salados' | 'bebidas' | 'cafeteria' | 'helados';

export interface MenuCategory {
    id: string;
    name: string;
    slug: string;
    group: MenuGroup;
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    imageUrl: string;
    badges?: string[];
    ingredients: string[];
    // Logic for availability
    stock?: number;
    isAvailable?: boolean;
}

export const CATEGORIES: MenuCategory[] = [
    // Promociones y Menu del Dia (Virtual Categories)
    { id: 'promociones', name: 'Promociones', slug: 'promociones', group: 'promociones' },
    { id: 'menu-dia', name: 'Menú del Día', slug: 'menu-dia', group: 'menu-deldia' },

    // Salados
    { id: 'completos', name: 'Completos', slug: 'completos', group: 'salados' },
    { id: 'churrascos', name: 'Churrascos', slug: 'churrascos', group: 'salados' },
    { id: 'hamburguesas', name: 'Hamburguesas', slug: 'hamburguesas', group: 'salados' },
    { id: 'pizzas', name: 'Pizzas', slug: 'pizzas', group: 'salados' },
    { id: 'papas', name: 'Papas Fritas', slug: 'papas', group: 'salados' },
    { id: 'empanadas', name: 'Empanadas', slug: 'empanadas', group: 'salados' },
    { id: 'picoteos', name: 'Picoteos', slug: 'picoteos', group: 'salados' },

    // Dulces
    { id: 'pasteles', name: 'Pastelería', slug: 'pasteles', group: 'dulces' },
    { id: 'tortas', name: 'Joyería Dulce', slug: 'tortas', group: 'dulces' },

    // Cafeteria y Helados
    { id: 'cafe', name: 'Cafetería', slug: 'cafe', group: 'cafeteria' },
    { id: 'helados', name: 'Helados Artesanales', slug: 'helados', group: 'helados' },

    // Bebidas
    { id: 'bebidas', name: 'Bebidas', slug: 'bebidas', group: 'bebidas' },
    { id: 'jugos', name: 'Jugos Naturales', slug: 'jugos', group: 'bebidas' },
];

export const MENU_ITEMS: MenuItem[] = [
    // --- PROMOCIONES (Total 7) ---
    {
        id: 'promo-pareja',
        name: 'Promo Pareja',
        description: '2 Churrascos Italianos + 2 Bebidas + Porción de Papas Fritas para compartir.',
        price: 14990,
        categoryId: 'promociones',
        imageUrl: 'https://i.blogs.es/3d640d/diseno-sin-titulo-1-/1366_2000.png',
        badges: ['Oferta', 'Para Dos'],
        ingredients: [],
        isAvailable: true,
    },
    {
        id: 'promo-familiar',
        name: 'Pack Familiar Pizza',
        description: '2 Pizzas Familiares a elección + Bebida 2.5L.',
        price: 24990,
        categoryId: 'promociones',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop',
        badges: ['Ahorras $5000'],
        ingredients: [],
        isAvailable: true,
    },
    {
        id: 'promo-once',
        name: 'Once Alemana',
        description: '2 Trozos de Kuchen del día + 2 Cafés tradicionales + Surtido de galletas.',
        price: 9990,
        categoryId: 'promociones',
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop',
        badges: ['Tarde Dulce'],
        ingredients: [],
        stock: 10,
    },
    {
        id: 'promo-estudiantes',
        name: 'Bajón Estudiante',
        description: 'Completo Italiano + Lata 350ml.',
        price: 4500,
        categoryId: 'promociones',
        imageUrl: 'https://images.unsplash.com/photo-1595690927142-8353d1602521?q=80&w=600&auto=format&fit=crop', // Better student meal
        badges: ['Económico'],
        ingredients: [],
        isAvailable: true,
    },

    {
        id: 'promo-cafe-torta',
        name: 'Café & Torta',
        description: 'Trozo de torta de la casa + Café Cortado.',
        price: 5500,
        categoryId: 'promociones',
        imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop',
        badges: ['Clásico'],
        ingredients: [],
        stock: 15,
    },
    {
        id: 'promo-kids',
        name: 'Cajita Hijitos',
        description: 'Cheeseburger pequeña + Papitas + Jugo + Juguete Sorpresa.',
        price: 6990,
        categoryId: 'promociones',
        imageUrl: 'https://images.unsplash.com/photo-1628292817293-8b776a386295?q=80&w=600&auto=format&fit=crop', // Better kids meal
        badges: ['Niños'],
        ingredients: [],
        isAvailable: true,
    },

    // --- MENU DEL DIA (Total 3) ---
    {
        id: 'menu-lunes',
        name: 'Cazuela de Vacuno',
        description: 'Incluye ensalada chilena, pan amasado, pebre y jugo natural.',
        price: 6500,
        categoryId: 'menu-dia',
        imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600&auto=format&fit=crop', // Soup
        ingredients: ['Vacuno', 'Choclo', 'Zapallo', 'Arroz'],
        stock: 12,
    },
    {
        id: 'menu-martes',
        name: 'Pastel de Choclo',
        description: 'Gratinado en greda, relleno con pino de carne, pollo, aceitunas y huevo duro.',
        price: 7500,
        categoryId: 'menu-dia',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1664475953046-24df9905646c?q=80&w=600&auto=format&fit=crop',
        ingredients: ['Choclo', 'Pino', 'Pollo', 'Huevo'],
        stock: 8,
    },
    {
        id: 'menu-miercoles',
        name: 'Pescado Frito',
        description: 'Merluza frita en batido crocante con agregado a elección (arroz, puré o papas mayo).',
        price: 7200,
        categoryId: 'menu-dia',
        imageUrl: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?q=80&w=600&auto=format&fit=crop',
        ingredients: ['Merluza', 'Batido', 'Agregado'],
        stock: 15,
    },

    // --- SALADOS: COMPLETOS (Expanded) ---
    {
        id: 'completo-italiano',
        name: 'Completo Italiano',
        description: 'Vienesa, palta, tomate, mayo.',
        price: 3500,
        categoryId: 'completos',
        imageUrl: 'https://images.unsplash.com/photo-1619250913866-e8d350937a09?q=80&w=600&auto=format&fit=crop',
        badges: ['Top 1'],
        ingredients: ['Vienesa', 'Palta', 'Tomate', 'Mayo'],
        isAvailable: true,
    },
    {
        id: 'completo-aleman',
        name: 'Completo Alemán',
        description: 'Vienesa, chucrut, tomate y mayo.',
        price: 3200,
        categoryId: 'completos',
        imageUrl: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=600&auto=format&fit=crop', // Hotdog
        ingredients: ['Vienesa', 'Chucrut', 'Tomate', 'Mayo'],
        isAvailable: true,
    },
    {
        id: 'as-luco',
        name: 'As Luco',
        description: 'Carne picada con queso fundido.',
        price: 4200,
        categoryId: 'completos',
        imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&auto=format&fit=crop',
        ingredients: ['Carne', 'Queso'],
        isAvailable: true,
    },
    {
        id: 'as-italiano',
        name: 'As Italiano',
        description: 'Carne picada, palta, tomate y mayo.',
        price: 4500,
        categoryId: 'completos',
        imageUrl: 'https://images.unsplash.com/photo-1619250913866-e8d350937a09?q=80&w=600&auto=format&fit=crop',
        ingredients: ['Carne', 'Palta', 'Tomate', 'Mayo'],
        isAvailable: true,
    },
    {
        id: 'completo-dinamico',
        name: 'Dinámico',
        description: 'Vienesa, palta, tomate, salsa americana, chucrut y mayo.',
        price: 3800,
        categoryId: 'completos',
        imageUrl: 'https://images.unsplash.com/photo-1619250913866-e8d350937a09?q=80&w=600&auto=format&fit=crop',
        ingredients: ['Vienesa', 'Palta', 'Tomate', 'Americana', 'Sauerkraut'],
        isAvailable: true,
    },

    // --- SALADOS: CHURRASCOS (Expanded) ---
    {
        id: 'churrasco-italiano',
        name: 'Churrasco Italiano',
        description: 'Posta rosada, palta, tomate, mayo.',
        price: 6500,
        categoryId: 'churrascos',
        imageUrl: 'https://images.unsplash.com/photo-1579888944880-d98341245702?q=80&w=600&auto=format&fit=crop', // Sandwich
        badges: ['Clásico'],
        ingredients: ['Carne', 'Palta', 'Tomate', 'Mayo'],
        isAvailable: true,
    },
    {
        id: 'churrasco-barrio',
        name: 'Churrasco Barrio',
        description: 'Carne, cebolla caramelizada, huevo, queso.',
        price: 6800,
        categoryId: 'churrascos',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop',
        badges: ['Nuevo'],
        ingredients: ['Carne', 'Cebolla', 'Huevo', 'Queso'],
        isAvailable: true,
    },
    {
        id: 'churrasco-chacarero',
        name: 'Chacarero',
        description: 'Carne, porotos verdes, tomate, ají verde.',
        price: 6600,
        categoryId: 'churrascos',
        imageUrl: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?q=80&w=600&auto=format&fit=crop',
        ingredients: ['Carne', 'Porotos Verdes', 'Tomate', 'Ají Verde'],
        isAvailable: true,
    },
    {
        id: 'churrasco-chemilico',
        name: 'Chemilico',
        description: 'Carne y huevo frito.',
        price: 5900,
        categoryId: 'churrascos',
        imageUrl: 'https://images.unsplash.com/photo-1553909489-cdb173a94d17?q=80&w=600&auto=format&fit=crop',
        ingredients: ['Carne', 'Huevo'],
        isAvailable: true,
    },
    {
        id: 'mechada-italiana',
        name: 'Mechada Italiana',
        description: 'Carne mechada de cocción lenta, palta, tomate, mayo.',
        price: 7500,
        categoryId: 'churrascos',
        imageUrl: 'https://images.unsplash.com/photo-1606756817293-68e5cc64c8d9?q=80&w=600&auto=format&fit=crop',
        badges: ['Premium'],
        ingredients: ['Mechada', 'Palta', 'Tomate', 'Mayo'],
        isAvailable: true,
    },

    // --- SALADOS: PAPAS (Expanded) ---
    {
        id: 'papas-rusticas',
        name: 'Papas Rústicas',
        description: 'Corte grueso con piel.',
        price: 3900,
        categoryId: 'papas',
        imageUrl: 'https://images.unsplash.com/photo-1630384060421-a4323ceca041?q=80&w=600&auto=format&fit=crop',
        ingredients: ['Papas', 'Sal'],
        isAvailable: true,
    },
    {
        id: 'papas-queso',
        name: 'Papas con Cheddar',
        description: 'Bañadas en salsa de queso cheddar.',
        price: 4900,
        categoryId: 'papas',
        imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9674c96b?q=80&w=600&auto=format&fit=crop',
        ingredients: ['Papas', 'Cheddar'],
        isAvailable: true,
    },
    {
        id: 'papas-bravas',
        name: 'Papas Bravas',
        description: 'Con salsa picante y alioli.',
        price: 4500,
        categoryId: 'papas',
        imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=600&auto=format&fit=crop',
        ingredients: ['Papas', 'Picante', 'Ajo'],
        isAvailable: true,
    },
    {
        id: 'chorrillana-clasica',
        name: 'Chorrillana Clásica',
        description: 'Para compartir.',
        price: 12500,
        categoryId: 'picoteos',
        imageUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=600&auto=format&fit=crop',
        badges: ['Para 3'],
        ingredients: ['Papas', 'Carne', 'Cebolla', 'Huevo'],
        isAvailable: true,
    },

    // --- DULCES: PASTELES (Expanded) ---
    {
        id: 'pie-limon',
        name: 'Pie de Limón',
        description: 'Merengue alto y tostado.',
        price: 2500,
        categoryId: 'pasteles',
        imageUrl: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=600&auto=format&fit=crop',
        ingredients: ['Limón', 'Merengue'],
        stock: 5,
    },
    {
        id: 'kuchen-nuez',
        name: 'Kuchen de Nuez',
        description: 'Caramelo y nuez.',
        price: 2800,
        categoryId: 'pasteles',
        imageUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=600&auto=format&fit=crop',
        stock: 2,
    },
    {
        id: 'medialuna',
        name: 'Medialunas',
        description: 'Dulce de leche opcional.',
        price: 1200,
        categoryId: 'pasteles',
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop',
        stock: 0,
    },
    {
        id: 'brazo-reina',
        name: 'Brazo de Reina',
        description: 'Bizcocho relleno de manjar casero.',
        price: 2000,
        categoryId: 'pasteles',
        imageUrl: 'https://images.unsplash.com/photo-1563729760374-f2526e38255e?q=80&w=600&auto=format&fit=crop', // Cake roll style
        stock: 8,
    },
    {
        id: 'tartaleta-fruta',
        name: 'Tartaleta de Frutas',
        description: 'Crema pastelera y fruta de la estación.',
        price: 2600,
        categoryId: 'pasteles',
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a029177b?q=80&w=600&auto=format&fit=crop',
        stock: 6,
    },

    // --- DULCES: TORTAS ---
    {
        id: 'torta-chocolate',
        name: 'Torta Trufa',
        description: 'Chocolate belga intenso.',
        price: 3500,
        categoryId: 'tortas',
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop',
        stock: 4,
    },
    {
        id: 'torta-zanahoria',
        name: 'Carrot Cake',
        description: 'Con frosting de queso crema y nueces.',
        price: 3200,
        categoryId: 'tortas',
        imageUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=600&auto=format&fit=crop',
        stock: 7,
    },

    // --- CAFETERIA (Expanded) ---
    {
        id: 'cafe-espresso',
        name: 'Espresso',
        description: 'Intenso y corto.',
        price: 1800,
        categoryId: 'cafe',
        imageUrl: 'https://images.unsplash.com/photo-1610889556284-8898166c4391?q=80&w=600&auto=format&fit=crop',
        ingredients: [],
        isAvailable: true,
    },
    {
        id: 'cafe-cortado',
        name: 'Cortado',
        description: 'Espresso cortado con un toque de leche.',
        price: 2000,
        categoryId: 'cafe',
        imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop',
        ingredients: [],
        isAvailable: true,
    },
    {
        id: 'cafe-latte',
        name: 'Latte',
        description: 'Espresso con abundante leche texturizada.',
        price: 2500,
        categoryId: 'cafe',
        imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop',
        ingredients: [],
        isAvailable: true,
    },
    {
        id: 'cafe-capuchino',
        name: 'Capuchino',
        description: 'Espresso, leche y espuma a partes iguales.',
        price: 2600,
        categoryId: 'cafe',
        imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600&auto=format&fit=crop',
        ingredients: [],
        isAvailable: true,
    },
    {
        id: 'cafe-mokaccino',
        name: 'Mokaccino',
        description: 'Café con chocolate y leche.',
        price: 2900,
        categoryId: 'cafe',
        imageUrl: 'https://images.unsplash.com/photo-1573887087034-77a83707cf96?q=80&w=600&auto=format&fit=crop',
        ingredients: [],
        isAvailable: true,
    },
    {
        id: 'te-infusion',
        name: 'Té e Infusiones',
        description: 'Variedad de té Dilmah y hierbas.',
        price: 1800,
        categoryId: 'cafe',
        imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop',
        ingredients: [],
        isAvailable: true,
    },

    // --- HELADOS ---
    {
        id: 'helado-cono-simple',
        name: 'Cono Simple',
        description: '1 sabor a elección.',
        price: 2000,
        categoryId: 'helados',
        imageUrl: 'https://images.unsplash.com/photo-1549395156-e0c1e11d6b12?q=80&w=600&auto=format&fit=crop',
        ingredients: [],
        isAvailable: true,
    },
    {
        id: 'helado-cono-doble',
        name: 'Cono Doble',
        description: '2 sabores a elección.',
        price: 3500,
        categoryId: 'helados',
        imageUrl: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?q=80&w=600&auto=format&fit=crop',
        ingredients: [],
        isAvailable: true,
    },
    {
        id: 'copa-helada',
        name: 'Copa de la Casa',
        description: '3 sabores, crema, salsa y galleta.',
        price: 5500,
        categoryId: 'helados',
        imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=600&auto=format&fit=crop',
        ingredients: [],
        isAvailable: true,
    },

    // --- EMPANADAS (Fix Image) ---
    {
        id: 'empanada-pino',
        name: 'Empanada de Pino',
        description: 'Pino jugoso con carne picada, cebolla, aceituna, huevo y pasas.',
        price: 2200,
        categoryId: 'empanadas',
        imageUrl: 'https://images.unsplash.com/photo-1567119053359-fbc3e12c148e?q=80&w=600&auto=format&fit=crop', // Better empanada
        ingredients: ['Masa', 'Pino', 'Huevo', 'Aceituna'],
        isAvailable: true,
    },
    {
        id: 'empanada-queso',
        name: 'Empanada de Queso',
        description: 'Queso mantecoso fundido.',
        price: 2000,
        categoryId: 'empanadas',
        imageUrl: 'https://images.unsplash.com/photo-1605333144703-a1af0e927f80?q=80&w=600&auto=format&fit=crop',
        ingredients: ['Masa', 'Queso'],
        isAvailable: true,
    },

    // --- BEBIDAS (Expanded) ---
    {
        id: 'cocacola',
        name: 'Coca Cola',
        description: 'Lata 350ml bien helada.',
        price: 1500,
        categoryId: 'bebidas',
        imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop',
        isAvailable: true,
    },
    {
        id: 'pepsi',
        name: 'Pepsi',
        description: 'Lata 350ml bien helada.',
        price: 1500,
        categoryId: 'bebidas',
        imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?q=80&w=600&auto=format&fit=crop',
        isAvailable: true,
    },
    {
        id: 'sprite',
        name: 'Sprite',
        description: 'Lata 350ml bien helada.',
        price: 1500,
        categoryId: 'bebidas',
        imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=600&auto=format&fit=crop',
        isAvailable: true,
    },
    {
        id: 'fanta',
        name: 'Fanta',
        description: 'Lata 350ml bien helada.',
        price: 1500,
        categoryId: 'bebidas',
        imageUrl: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?q=80&w=600&auto=format&fit=crop',
        isAvailable: true,
    },
    {
        id: 'jugo-naranja',
        name: 'Jugo de Naranja',
        description: 'Exprimido natural, 500cc.',
        price: 3500,
        categoryId: 'jugos',
        imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=600&auto=format&fit=crop',
        isAvailable: true,
    },
    {
        id: 'jugo-frutilla',
        name: 'Jugo de Frutilla',
        description: 'Pulpa de fruta natural y agua, 500cc.',
        price: 3500,
        categoryId: 'jugos',
        imageUrl: 'https://images.unsplash.com/photo-1596708453535-77ac056cc462?q=80&w=600&auto=format&fit=crop',
        isAvailable: true,
    },
    {
        id: 'schop-artesanal',
        name: 'Schop Artesanal 500cc',
        description: 'Cerveza rubia o ámbar de producción local.',
        price: 4500,
        categoryId: 'bebidas',
        imageUrl: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?q=80&w=600&auto=format&fit=crop',
        ingredients: ['Cebada', 'Lúpulo', 'Agua'],
        isAvailable: true,
    },
];
