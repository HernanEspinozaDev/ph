import { getCategories } from '@/app/actions/categories';
import CategoryManager from '@/components/ventas/CategoryManager';

export const runtime = 'edge';

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Categorías</h1>
            <CategoryManager categories={categories} />
        </div>
    );
}
