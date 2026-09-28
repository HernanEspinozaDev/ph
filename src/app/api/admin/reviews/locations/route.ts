import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-api';
import { GoogleBusinessProfileError, isAccountName, listBusinessLocations } from '@/lib/google-business-profile';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const accountName = request.nextUrl.searchParams.get('accountName');
  if (!isAccountName(accountName)) {
    return NextResponse.json({ error: 'Selecciona una cuenta válida.' }, { status: 400 });
  }
  try {
    return NextResponse.json({ locations: await listBusinessLocations(accountName) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const status = error instanceof GoogleBusinessProfileError ? error.status : 500;
    const message = error instanceof Error ? error.message : 'No se pudieron consultar las ubicaciones.';
    console.error('Business Profile locations error:', message);
    return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
  }
}
