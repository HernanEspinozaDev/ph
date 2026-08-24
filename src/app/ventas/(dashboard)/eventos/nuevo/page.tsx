import EventoForm from '../EventoForm';

export const runtime = 'edge';

export default function NuevoEventoPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Agregar Producto de Catering</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <EventoForm />
            </div>
        </div>
    );
}
