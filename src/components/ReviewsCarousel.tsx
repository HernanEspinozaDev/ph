'use client';

import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useRef, useState } from 'react';
import type { GoogleReview, ReviewsResponse } from '@/lib/google-business-profile';

interface ReviewsCarouselProps {
  initialReviews: GoogleReview[];
  totalReviewCount: number;
  nextPageToken?: string;
  googleMapsUrl: string;
}

function displayDate(value?: string) {
  if (!value) return 'Fecha no disponible';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible';
  return new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium' }).format(date);
}

function ratingNumber(rating?: string) {
  return ({ ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 } as Record<string, number>)[rating || ''] || 0;
}

export function ReviewsCarousel({ initialReviews, totalReviewCount, nextPageToken: initialNextPageToken, googleMapsUrl }: ReviewsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [reviews, setReviews] = useState(initialReviews);
  const [nextPageToken, setNextPageToken] = useState(initialNextPageToken || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function move(direction: -1 | 1) {
    const carousel = carouselRef.current;
    const card = carousel?.querySelector<HTMLElement>('[data-review-card]');
    if (!carousel || !card) return;
    const styles = getComputedStyle(carousel);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 16;
    carousel.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' });
  }

  async function loadNextPage() {
    if (!nextPageToken || loading) return;
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({ pageToken: nextPageToken });
      const response = await fetch(`/api/reviews?${query}`, { cache: 'no-store' });
      const result = await response.json() as ReviewsResponse & { error?: string };
      if (!response.ok) throw new Error(result.error || 'No se pudieron cargar más reseñas.');
      setReviews((current) => {
        const knownNames = new Set(current.map((review) => review.name).filter(Boolean));
        return [...current, ...(result.reviews || []).filter((review) => !review.name || !knownNames.has(review.name))];
      });
      setNextPageToken(result.nextPageToken || '');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudieron cargar más reseñas.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-600">Mostrando {reviews.length} de {totalReviewCount} reseñas</p>
        <div className="flex items-center gap-2">
          <span className="mr-1 hidden text-xs text-gray-500 sm:inline">Desliza para ver más</span>
          <button type="button" onClick={() => move(-1)} aria-label="Ver reseñas anteriores" className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-amber-900 shadow-sm transition hover:bg-amber-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700">
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Ver reseñas siguientes" className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-amber-900 shadow-sm transition hover:bg-amber-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700">
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div ref={carouselRef} tabIndex={0} aria-label="Carrusel de reseñas de Google" className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-1 pb-5 pt-1 [scrollbar-color:#c9ad98_#eee7df] [scrollbar-width:thin]">
        {reviews.map((review, index) => {
          const rating = ratingNumber(review.starRating);
          const author = review.reviewer?.displayName || (review.reviewer?.isAnonymous ? 'Usuario anónimo de Google' : 'Usuario de Google');
          return (
            <article data-review-card key={review.name || `${review.createTime}-${index}`} className="flex h-[360px] w-[min(84vw,340px)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#e9e3d9] bg-white p-5 shadow-[0_8px_24px_rgba(55,40,25,0.04)] transition hover:border-[#d8b9a4] hover:shadow-[0_12px_30px_rgba(55,40,25,0.08)] sm:h-[370px] sm:w-[clamp(280px,34%,340px)]">
              <div className="flex min-w-0 items-center gap-3">
                <div aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f2e9df] font-bold text-amber-900">{author.charAt(0).toLocaleUpperCase('es-CL') || 'G'}</div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-gray-900">{author}</h3>
                  <p className="mt-1 text-xs text-gray-500">{displayDate(review.createTime || review.updateTime)}</p>
                </div>
              </div>

              <div className="mt-4 flex" aria-label={`${rating} de 5 estrellas`}>
                {[...Array(5)].map((_, star) => <Star key={star} aria-hidden="true" className={`h-4 w-4 ${star < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />)}
              </div>

              <div tabIndex={0} aria-label="Texto completo de la reseña; puedes desplazarte dentro de esta tarjeta" className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2 [scrollbar-color:#d8c6b7_transparent] [scrollbar-width:thin]">
                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">{review.comment?.trim() || 'Esta reseña no incluye un comentario escrito.'}</p>
                {review.reviewReply?.comment && <div className="mt-4 rounded-lg bg-[#f8f5f0] p-3 text-xs leading-5 text-gray-700"><strong className="block text-gray-900">Respuesta del negocio</strong><p className="mt-1 whitespace-pre-wrap">{review.reviewReply.comment}</p></div>}
              </div>

              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 w-fit text-xs font-medium text-blue-700 underline-offset-4 hover:underline">Reseña publicada en Google</a>
            </article>
          );
        })}
      </div>

      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
      {nextPageToken && <div className="mt-3 text-center"><button type="button" onClick={loadNextPage} disabled={loading} className="rounded-md border border-amber-800 px-5 py-2.5 text-sm font-semibold text-amber-900 transition hover:bg-amber-900 hover:text-white disabled:opacity-50">{loading ? 'Cargando reseñas…' : 'Cargar siguientes 50 reseñas'}</button></div>}
    </div>
  );
}
