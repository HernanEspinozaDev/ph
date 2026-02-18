'use client';

import Image from 'next/image';
import { Product } from '@/app/actions/menu';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from "embla-carousel-autoplay"

interface FeaturedCarouselProps {
    products: Product[];
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-4">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 4000,
                    }),
                ]}
                className="w-full"
            >
                <CarouselContent className="-ml-2 md:-ml-4">
                    {products.map((product) => (
                        <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                            <div className="p-1 h-full">
                                <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow">
                                    <CardContent className="flex flex-col items-center p-0 h-full">
                                        <div className="relative w-full aspect-square overflow-hidden rounded-t-lg">
                                            {product.imagen_url ? (
                                                <Image
                                                    src={product.imagen_url}
                                                    alt={product.nombre}
                                                    fill
                                                    className="object-cover transition-transform hover:scale-105 duration-300"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                                    No imagen
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-grow p-4 text-center w-full">
                                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.nombre}</h3>
                                            <div className="mt-auto">
                                                <span className="text-xl font-bold text-primary">
                                                    ${product.precio.toLocaleString('es-CL')}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-12" />
                <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>
        </div>
    );
}
