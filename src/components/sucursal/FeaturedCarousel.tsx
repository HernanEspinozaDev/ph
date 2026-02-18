'use client';

import * as React from 'react';
import Image from 'next/image';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import AutoScroll from 'embla-carousel-auto-scroll';
import { Product } from '@/app/actions/menu';

interface FeaturedCarouselProps {
    products: Product[];
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
    if (!products || products.length === 0) {
        return null;
    }

    // Triple products for smoother infinite scroll (ensure at least enough items for marquee)
    const displayProducts = [...products, ...products, ...products, ...products];

    const borderColors = [
        'border-[#FDBF47]', // Yellow
        'border-[#E44E7D]', // Pink
        'border-[#E57F53]', // Orange
        'border-[#008A4D]', // Green
    ];

    return (
        <div className="w-full relative">
            <Carousel
                opts={{
                    loop: true,
                    align: 'start',
                    dragFree: true,
                }}
                plugins={[
                    AutoScroll({
                        speed: 1, // Slow continuous scroll
                        stopOnInteraction: false,
                        stopOnMouseEnter: true,
                    }),
                ]}
                className="w-full"
            >
                <CarouselContent className="">
                    {displayProducts.map((product, index) => (
                        <CarouselItem key={`${product.id}-${index}`} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                            <div className="flex flex-col items-center py-6 group cursor-grab active:cursor-grabbing">
                                {/* Circular Image Container */}
                                <div
                                    className={`
                    w-48 h-48 md:w-56 md:h-56 
                    rounded-full overflow-hidden
                    border-[6px] ${borderColors[index % borderColors.length]}
                    relative mb-4
                    transition-transform duration-300 group-hover:scale-105
                    shadow-md bg-white
                  `}
                                >
                                    {product.imagen_url ? (
                                        <Image
                                            src={product.imagen_url}
                                            alt={product.nombre}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 200px, 250px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground font-bold">
                                            Sin Foto
                                        </div>
                                    )}
                                </div>

                                {/* Text Info */}
                                <div className="text-center space-y-1">
                                    <h3 className="font-bold text-lg leading-tight md:text-xl px-2 min-h-[3rem] flex items-center justify-center">
                                        {product.nombre}
                                    </h3>
                                    <p className="font-bold text-xl text-primary">
                                        ${product.precio.toLocaleString('es-CL')}
                                    </p>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}
