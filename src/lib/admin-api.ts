import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function requireAdminApi() {
  const session = await getSession();
  if (session) return null;
  return NextResponse.json({ error: 'Inicia sesión en el panel de ventas.' }, { status: 401 });
}
