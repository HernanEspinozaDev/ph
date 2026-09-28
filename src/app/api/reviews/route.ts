import { NextRequest, NextResponse } from 'next/server';
import { GoogleBusinessProfileError, getReviewsSettings, listLocationReviews } from '@/lib/google-business-profile';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const settings = await getReviewsSettings();
    if (!settings || !settings.enabled) {
      return NextResponse.json({ reviews: [], averageRating: 0, totalReviewCount: 0 }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const pageToken = request.nextUrl.searchParams.get('pageToken') || undefined;
    const response = await listLocationReviews(settings.location_name, settings.order_by, pageToken);
    return NextResponse.json(response, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const status = error instanceof GoogleBusinessProfileError ? error.status : 500;
    console.error('Public Business Profile reviews error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Las reseñas no están disponibles en este momento.' },
      { status, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
