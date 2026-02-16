import ChangePassword from '@/components/ventas/ChangePassword';

export const runtime = 'edge';

export default function ProfilePage() {
    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>
                <div className="max-w-3xl">
                    <ChangePassword />
                </div>
            </div>
        </div>
    );
}
