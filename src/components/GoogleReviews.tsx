import { Star } from 'lucide-react';
import { getReviewsSettings, listLocationReviews } from '@/lib/google-business-profile';
import { ReviewsCarousel } from './ReviewsCarousel';

export async function GoogleReviews() {
  try {
    const settings = await getReviewsSettings();
    if (!settings || !settings.enabled) return null;

    const result = await listLocationReviews(settings.location_name, settings.order_by);
    const reviews = result.reviews ?? [];
    if (!reviews.length) return null;

    const googleUrl = settings.place_id
      ? `https://www.google.com/maps/search/?api=1&query=Pasteler%C3%ADa%20Hijitos&query_place_id=${encodeURIComponent(settings.place_id)}`
      : 'https://www.google.com/maps/search/?api=1&query=Pasteler%C3%ADa+Hijitos+Cartagena';

    return (
      <section aria-labelledby="google-reviews-title" className="overflow-hidden border-y border-gray-100 bg-[#faf8f5] py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-9 text-center sm:mb-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-900">Opiniones de Google</p>
            <h2 id="google-reviews-title" className="font-serif text-3xl font-medium text-primary sm:text-4xl">Lo que dicen nuestros clientes</h2>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{result.averageRating?.toFixed(1) || '—'}</span>
              <span className="flex" aria-label={`${Math.round(result.averageRating || 0)} de 5 estrellas`}>
                {[...Array(5)].map((_, index) => <Star key={index} aria-hidden="true" className={`h-4 w-4 ${index < Math.round(result.averageRating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />)}
              </span>
              <span>{result.totalReviewCount || 0} reseñas</span>
              <span aria-hidden="true">·</span>
              <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-700 underline-offset-4 hover:underline">Ver en Google</a>
            </div>
          </div>

          <ReviewsCarousel
            initialReviews={reviews}
            totalReviewCount={result.totalReviewCount || 0}
            nextPageToken={result.nextPageToken}
            googleMapsUrl={googleUrl}
          />
        </div>
      </section>
    );
  } catch (error) {
    console.error('No se pudieron cargar las reseñas de Google Business Profile:', error instanceof Error ? error.message : error);
    return null;
  }
}
