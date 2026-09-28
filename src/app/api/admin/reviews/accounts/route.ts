import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-api';
import { GoogleBusinessProfileError, listBusinessAccounts } from '@/lib/google-business-profile';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  try {
    return NextResponse.json({ accounts: await listBusinessAccounts() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const status = error instanceof GoogleBusinessProfileError ? error.status : 500;
    const message = error instanceof Error ? error.message : 'No se pudieron consultar las cuentas de Google.';
    console.error('Business Profile accounts error:', message);
    return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
  }
}
