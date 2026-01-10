import Image from 'next/image';
import { MenuItem } from '@/lib/menuData';
import { formatPrice } from '@/lib/utils'; // Moved here
import { cn } from '@/lib/utils'; // Assuming cn is in utils

interface ProductCardProps {
    item: MenuItem;
    onClick: (item: MenuItem) => void;
}

export function ProductCard({ item, onClick }: ProductCardProps) {
    return (
        <div
            onClick={() => onClick(item)}
            className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md border border-stone-100 flex gap-4 cursor-pointer transition-all hover:border-amber-300 group h-full text-left"
        >
            {/* Image Left */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-stone-100">
                <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Status Badge */}
                {item.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xs font-bold uppercase">Agotado</span>
                    </div>
                )}
                {((item.stock !== undefined && item.stock > 0 && item.stock < 5) || (item.isAvailable === false)) && (
                    <span className="absolute bottom-1 right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                        Pocos
                    </span>
                )}
            </div>

            {/* Content Right */}
            <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-stone-800 line-clamp-2 leading-tight group-hover:text-amber-600 transition-colors">
                            {item.name}
                        </h3>
                        <span className="font-bold text-amber-600 text-lg whitespace-nowrap">
                            {formatPrice(item.price)}
                        </span>
                    </div>
                    <p className="text-sm text-stone-500 mt-1 line-clamp-2">
                        {item.description}
                    </p>
                </div>

                <div className="flex gap-2 mt-2">
                    {item.badges?.map(badge => (
                        <span key={badge} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
