import { Star } from 'lucide-react';
import { ReviewsCarousel } from './ReviewsCarousel';

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

interface LegacyReview {
  author_name: string;
  author_url: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface LegacyPlaceDetailsResponse {
  result?: {
    name: string;
    rating?: number;
    user_ratings_total?: number;
    reviews?: LegacyReview[];
  };
  status: string;
  error_message?: string;
}

export async function GoogleReviews() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn("Faltan las credenciales de Google Places en el archivo .env");
    return null;
  }

  try {
    // Usamos la API antigua de Places (Place Details) que sí soporta reviews_sort=newest
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&reviews_sort=newest&fields=name,reviews,rating,user_ratings_total&key=${apiKey}&language=es`,
      {
        headers: {
          'Referer': 'http://localhost:9002',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as LegacyPlaceDetailsResponse;

    if (data.status !== 'OK' || !data.result) {
      console.error("Error fetching Google Reviews:", data.status, data.error_message);
      return null;
    }

    const { reviews, rating, user_ratings_total: userRatingCount } = data.result;

    if (!reviews || reviews.length === 0) return null;

    // Filtramos reseñas vacías
    let validLegacyReviews = reviews.filter((r) => r.text && r.text.length > 10);

    if (validLegacyReviews.length === 0) return null;

    // Mapeamos al formato que espera nuestro carrusel (el formato de la API nueva)
    const validReviews: GoogleReviewNew[] = validLegacyReviews.map(r => ({
      authorAttribution: {
        displayName: r.author_name,
        uri: r.author_url,
        photoUri: r.profile_photo_url,
      },
      rating: r.rating,
      relativePublishTimeDescription: r.relative_time_description,
      text: {
        text: r.text,
        languageCode: 'es',
      },
      publishTime: new Date(r.time * 1000).toISOString()
    }));

    return (
      <section className="py-24 bg-gray-50 border-y border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-4xl font-light text-primary">Lo que dicen nuestros clientes</h3>
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium text-lg">{rating?.toFixed(1)}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.round(rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-gray-500 text-sm">({userRatingCount} reseñas en Google)</span>
            </div>
          </div>

          <ReviewsCarousel reviews={validReviews} />
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return null;
  }
}
