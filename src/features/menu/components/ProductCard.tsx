import Image from 'next/image';
import { Product } from '@/types/menu';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProductCardProps {
    item: Product;
    onClick: (item: Product) => void;
    theme?: 'default' | 'pasteleria';
}

export function ProductCard({ item, onClick, theme = 'default' }: ProductCardProps) {
    const isPasteleria = theme === 'pasteleria';

    return (
        <div
            onClick={() => onClick(item)}
            className={cn(
                "bg-white rounded-xl p-3 shadow-sm hover:shadow-md border border-stone-100 flex gap-4 cursor-pointer transition-all group h-full text-left",
                isPasteleria ? "hover:border-primary" : "hover:border-amber-300"
            )}
        >
            {/* Image Left */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-stone-100">
                {item.imagen_url ? (
                    <Image
                        src={item.imagen_url}
                        alt={item.nombre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400">
                        <span className="text-xs">Sin imagen</span>
                    </div>
                )}

                {/* Status Badge - Logic simplified for now as stock is not in DB yet */}
                {item.disponible === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xs font-bold uppercase">Agotado</span>
                    </div>
                )}
            </div>

            {/* Content Right */}
            <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <h3 className={cn(
                            "font-bold text-stone-800 line-clamp-2 leading-tight transition-colors",
                            isPasteleria ? "group-hover:text-primary" : "group-hover:text-amber-600"
                        )}>
                            {item.nombre}
                        </h3>
                        <span className={cn(
                            "font-bold text-lg whitespace-nowrap",
                            isPasteleria ? "text-primary" : "text-amber-600"
                        )}>
                            ${item.precio.toLocaleString('es-CL')}
                        </span>
                    </div>
                    <p className="text-sm text-stone-500 mt-1 line-clamp-2">
                        {item.ingredientes}
                    </p>
                </div>

                {item.gestionar_stock === 1 && (
                    <div className="mt-2 flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {item.stock > 0 ? `${item.stock} disponibles` : 'Agotado'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
