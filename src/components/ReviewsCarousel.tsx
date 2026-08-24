'use client';

import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

// Re-usamos la interfaz que viene del servidor
interface GoogleReviewNew {
  authorAttribution: {
    displayName: string;
    uri: string;
    photoUri: string;
  };
  rating: number;
  relativePublishTimeDescription: string;
  text?: {
    text: string;
    languageCode: string;
  };
  publishTime: string;
}

interface ReviewsCarouselProps {
  reviews: GoogleReviewNew[];
}

export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      {/* Botones de navegación (ocultos en móvil, visibles en hover en desktop) */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-white p-3 rounded-full shadow-lg border border-gray-100 text-gray-500 hover:text-primary hover:scale-110 transition-all hidden md:block opacity-0 group-hover:opacity-100"
        aria-label="Anterior reseña"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-white p-3 rounded-full shadow-lg border border-gray-100 text-gray-500 hover:text-primary hover:scale-110 transition-all hidden md:block opacity-0 group-hover:opacity-100"
        aria-label="Siguiente reseña"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Contenedor del Carrusel (Scroll Snap) */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-4 px-4 -mx-4 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.map((review, idx) => (
          <div 
            key={idx} 
            className="snap-center shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-auto min-h-[300px]"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                {review.authorAttribution?.photoUri ? (
                  <Image 
                    src={review.authorAttribution.photoUri} 
                    alt={`Foto de ${review.authorAttribution.displayName}`}
                    fill
                    className="object-cover"
                    unoptimized 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                    {review.authorAttribution?.displayName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 line-clamp-1">
                  {review.authorAttribution?.displayName || 'Usuario de Google'}
                </h4>
                <span className="text-sm text-gray-500">{review.relativePublishTimeDescription}</span>
              </div>
            </div>
            
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < (review.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                />
              ))}
            </div>

            <p className="text-gray-600 font-light leading-relaxed flex-grow italic line-clamp-6">
              &quot;{review.text?.text}&quot;
            </p>
            
            {review.authorAttribution?.uri && (
              <a 
                href={review.authorAttribution.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-6 text-sm text-blue-600 hover:underline flex items-center gap-1 w-fit"
              >
                Ver en Google
              </a>
            )}
          </div>
        ))}
      </div>
      
      {/* Hint para scroll en móvil */}
      <div className="text-center text-sm text-gray-400 md:hidden mt-2">
        Desliza para ver más →
      </div>
    </div>
  );
}
