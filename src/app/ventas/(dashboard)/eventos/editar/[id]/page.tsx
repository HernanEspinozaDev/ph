import EventoForm from '../../EventoForm';
import { getEventoProductos } from '@/app/actions/eventos-admin';
import { redirect } from 'next/navigation';

export const runtime = 'edge';

export default async function EditarEventoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const productos = await getEventoProductos();
    const producto = productos.find(p => p.id === parseInt(id));

    if (!producto) {
        redirect('/ventas/eventos');
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Editar Producto: {producto.nombre}</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <EventoForm initialData={producto} />
            </div>
        </div>
    );
}
