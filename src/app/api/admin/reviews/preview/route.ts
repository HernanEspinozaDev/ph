import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-api';
import {
  GoogleBusinessProfileError,
  isLocationName,
  isReviewsOrder,
  listLocationReviews,
} from '@/lib/google-business-profile';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const { searchParams } = request.nextUrl;
  const locationName = searchParams.get('locationName');
  const orderBy = searchParams.get('orderBy') || 'updateTime desc';
  const pageToken = searchParams.get('pageToken') || undefined;
  if (!isLocationName(locationName) || !isReviewsOrder(orderBy)) {
    return NextResponse.json({ error: 'Selecciona una ubicación y orden válidos.' }, { status: 400 });
  }
  try {
    const reviews = await listLocationReviews(locationName, orderBy, pageToken);
    return NextResponse.json(reviews, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const status = error instanceof GoogleBusinessProfileError ? error.status : 500;
    const message = error instanceof Error ? error.message : 'No se pudieron consultar las reseñas.';
    console.error('Business Profile review preview error:', message);
    return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
  }
}
