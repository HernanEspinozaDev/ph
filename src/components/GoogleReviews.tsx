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

interface PlaceDetailsNewResponse {
  name: string;
  id: string;
  rating?: number;
  userRatingCount?: number;
  reviews?: GoogleReviewNew[];
  error?: {
    message: string;
    status: string;
  };
}

export async function GoogleReviews() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn("Faltan las credenciales de Google Places en el archivo .env");
    return null;
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?languageCode=es`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
          'Referer': 'http://localhost:9002',
        },
        cache: 'no-store' // Evitar caché en desarrollo
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error(`HTTP error! status: ${response.status}`, errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as PlaceDetailsNewResponse;

    if (data.error) {
      console.error("Error fetching Google Reviews:", data.error.status, data.error.message);
      return null;
    }

    const { reviews, rating, userRatingCount } = data;

    if (!reviews || reviews.length === 0) return null;

    // Filtramos reseñas vacías o muy cortas para mantener un buen diseño
    // Tomamos todas las que nos da Google (hasta 5 por defecto en este endpoint)
    const validReviews = reviews.filter((r) => r.text?.text && r.text.text.length > 10);

    if (validReviews.length === 0) return null;

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
