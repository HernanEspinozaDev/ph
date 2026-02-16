import { getSession } from '@/lib/session';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const runtime = 'edge';

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect('/ventas/login');
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido, {session.username}!</h1>
                <p className="text-gray-500">Panel de Administración de Pastelería Hijitos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/ventas/productos" className="group">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-400 h-full flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600">Gestionar Productos</h2>
                        <p className="text-gray-500 text-sm">Agregar nuevos productos, editar precios, controlar stock y disponibilidad.</p>
                    </div>
                </Link>

                <Link href="/ventas/categorias" className="group">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-purple-400 h-full flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600">Gestionar Categorías</h2>
                        <p className="text-gray-500 text-sm">Crear y ordenar categorías para organizar el menú de productos.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
