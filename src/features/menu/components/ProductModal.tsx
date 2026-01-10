import Image from 'next/image';
import { MenuItem } from '@/lib/menuData';
import { formatPrice, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { X, ChefHat, Clock } from 'lucide-react';

interface ProductModalProps {
    product: MenuItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md w-[95vw] p-0 overflow-hidden bg-white text-stone-800">
                <DialogTitle className="sr-only">
                    {product ? product.name : 'Detalle del producto'}
                </DialogTitle>
                {product && (
                    <>
                        <div className="relative h-64 w-full">
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-3 top-3 bg-black/20 text-white hover:bg-black/40 rounded-full backdrop-blur-sm"
                                onClick={onClose}
                            >
                                <X className="h-5 w-5" />
                            </Button>

                            <div className="absolute bottom-4 left-6">
                                <h2 className="text-2xl font-bold text-white shadow-black/50 drop-shadow-md">{product.name}</h2>
                                <p className="font-bold text-amber-400 text-xl drop-shadow-md">{formatPrice(product.price)}</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <p className="text-stone-600 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Stock/Availability in Modal */}
                            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-100">
                                {product.stock !== undefined ? (
                                    <>
                                        <Clock className={cn("h-5 w-5", product.stock === 0 ? "text-red-500" : "text-amber-500")} />
                                        <div>
                                            <p className="text-xs text-stone-500 font-bold uppercase">Disponibilidad</p>
                                            <p className={cn("text-sm font-medium", product.stock === 0 ? "text-red-600" : "text-stone-800")}>
                                                {product.stock === 0 ? "Agotado temporalmente" : `Quedan ${product.stock} unidades`}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <ChefHat className="h-5 w-5 text-emerald-500" />
                                        <div>
                                            <p className="text-xs text-stone-500 font-bold uppercase">Cocina</p>
                                            <p className="text-sm font-medium text-stone-800">Preparado al momento</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {product.ingredients.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-stone-400 uppercase mb-2">Ingredientes</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {product.ingredients.map((ing) => (
                                            <span key={ing} className="px-2 py-1 rounded-md bg-stone-100 text-stone-600 text-xs font-medium">
                                                {ing}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-12 rounded-lg text-lg shadow-lg shadow-amber-200 mt-2">
                                ¡Lo quiero!
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
