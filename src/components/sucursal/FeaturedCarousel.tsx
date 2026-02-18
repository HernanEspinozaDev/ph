'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/carousel'; // Adjust import if Card is not exported from carousel, but likely from ui/card
// Actually, Card is usually from ui/card. I should import from there or just use div if I want custom style.
// Let's use clean divs for the circle design.
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

    // Double the products to ensure smooth infinite scroll if few items
    const displayProducts = products.length < 10 ? [...products, ...products, ...products] : products;

    const bgColors = [
        'bg-[#FDBF47]', // Yellow
        'bg-[#E44E7D]', // Pink
        'bg-[#E57F53]', // Orange
        'bg-[#008A4D]', // Green
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
                        speed: 1,
                        stopOnInteraction: false,
                        stopOnMouseEnter: true,
                    }),
                ]}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {displayProducts.map((product, index) => (
                        <CarouselItem key={`${product.id}-${index}`} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                            <div className="flex flex-col items-center py-8 group cursor-pointer">
                                {/* Circle Background */}
                                <div
                                    className={`
                    w-48 h-48 md:w-56 md:h-56 rounded-full 
                    ${bgColors[index % bgColors.length]}
                    flex items-center justify-center
                    relative mb-4
                    transition-transform duration-300 group-hover:scale-105
                    shadow-lg
                  `}
                                >
                                    {/* Image overlapping */}
                                    <div className="relative w-40 h-40 md:w-48 md:h-48">
                                        {product.imagen_url ? (
                                            <Image
                                                src={product.imagen_url}
                                                alt={product.nombre}
                                                fill
                                                className="object-contain drop-shadow-xl"
                                                sizes="(max-width: 768px) 150px, 200px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white font-bold opacity-50">
                                                Sin Foto
                                            </div>
                                        )}
                                    </div>
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
                {/* Navigation Arrows - Custom positioned */}
                <div className="hidden md:block">
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-green-600 text-white border-none hover:bg-green-700 hover:text-white" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-green-600 text-white border-none hover:bg-green-700 hover:text-white" />
                </div>
            </Carousel>
        </div>
    );
}
