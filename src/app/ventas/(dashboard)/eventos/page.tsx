import { getEventoProductos } from '@/app/actions/eventos-admin';
import Link from 'next/link';

export const runtime = 'edge';

export default async function EventosAdminPage() {
    const productos = await getEventoProductos();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Catering (Eventos)</h1>
                <Link
                    href="/ventas/eventos/nuevo"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    + Nuevo Producto
                </Link>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio U.</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidades</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {productos.map((producto) => {
                            const mainImg = producto.imagenes?.find(img => img.es_principal) || producto.imagenes?.[0];
                            const cantidades = `Desde ${producto.cantidad_minima || 1} u.`;

                            return (
                                <tr key={producto.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {mainImg ? (
                                            <img src={mainImg.url} alt={producto.nombre} className="w-12 h-12 object-cover rounded-md" />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">Sin img</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {producto.nombre}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                        {producto.categoria}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${producto.precio_unitario}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {cantidades || 'Ninguna'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${producto.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {producto.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={`/ventas/eventos/editar/${producto.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                                            Editar
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                        {productos.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                                    No hay productos de evento configurados. ¡Agrega el primero!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
