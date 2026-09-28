import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { requireAdminApi } from '@/lib/admin-api';
import { getReviewsSettings, isAccountName, isLocationName, isReviewsOrder } from '@/lib/google-business-profile';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  try {
    const settings = await getReviewsSettings();
    return NextResponse.json({ settings }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Could not read Google reviews settings:', error);
    return NextResponse.json({ error: 'No se pudo leer la configuración. Aplica la migración D1 pendiente.' }, { status: 503 });
  }
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  try {
    const body = await request.json() as {
      accountName?: unknown;
      locationName?: unknown;
      locationTitle?: unknown;
      locationAddress?: unknown;
      placeId?: unknown;
      orderBy?: unknown;
      enabled?: unknown;
    };

    if (!isAccountName(body.accountName) || !isLocationName(body.locationName) ||
      !body.locationName.startsWith(`${body.accountName}/locations/`) || !isReviewsOrder(body.orderBy)) {
      return NextResponse.json({ error: 'Revisa la cuenta, ubicación y orden seleccionados.' }, { status: 400 });
    }

    const accountName = body.accountName;
    const locationName = body.locationName;
    const orderBy = body.orderBy;

    const locationTitle = typeof body.locationTitle === 'string' ? body.locationTitle.trim().slice(0, 200) : '';
    const locationAddress = typeof body.locationAddress === 'string' ? body.locationAddress.trim().slice(0, 300) : '';
    const placeId = typeof body.placeId === 'string' ? body.placeId.trim().slice(0, 200) : '';
    if (!locationTitle) return NextResponse.json({ error: 'La ubicación seleccionada no tiene nombre.' }, { status: 400 });

    const { env } = getRequestContext();
    await env.DB.prepare(`
      INSERT INTO google_reviews_settings
        (id, account_name, location_name, location_title, location_address, place_id, order_by, enabled, updated_at)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        account_name = excluded.account_name,
        location_name = excluded.location_name,
        location_title = excluded.location_title,
        location_address = excluded.location_address,
        place_id = excluded.place_id,
        order_by = excluded.order_by,
        enabled = excluded.enabled,
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      accountName,
      locationName,
      locationTitle,
      locationAddress || null,
      placeId || null,
      orderBy,
      body.enabled === false ? 0 : 1,
    ).run();

    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Could not save Google reviews settings:', error);
    return NextResponse.json({ error: 'No se pudo guardar la configuración de reseñas.' }, { status: 500 });
  }
}
