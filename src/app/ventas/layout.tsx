import { logout } from '@/app/actions/auth';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/ventas" className="text-xl font-bold text-blue-600">
                                    Panel Ventas
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/ventas"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Productos
                                </Link>
                                <Link
                                    href="/ventas/categorias"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Categorías
                                </Link>
                                <Link
                                    href="/ventas/perfil"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Perfil / Configuración
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <form action={logout}>
                                    <button
                                        type="submit"
                                        className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Mobile menu, show/hide based on menu state. For simplicity in v1, just links below */}
                <div className="sm:hidden border-t border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4 p-4 text-center">
                        <Link href="/ventas" className="text-sm font-medium text-gray-700 hover:text-blue-600">Productos</Link>
                        <Link href="/ventas/categorias" className="text-sm font-medium text-gray-700 hover:text-blue-600">Categorías</Link>
                        <Link href="/ventas/perfil" className="text-sm font-medium text-gray-700 hover:text-blue-600">Perfil</Link>
                    </div>
                </div>
            </nav>

            <main className="py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
