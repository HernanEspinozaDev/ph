import { getRequestContext } from '@cloudflare/next-on-pages';

export type BusinessAccount = {
  name: string;
  accountName?: string;
  type?: string;
  role?: string;
};

export type BusinessLocation = {
  name: string;
  title?: string;
  storefrontAddress?: {
    addressLines?: string[];
    locality?: string;
    administrativeArea?: string;
  };
  metadata?: { placeId?: string };
};

export type GoogleReview = {
  name?: string;
  reviewer?: { displayName?: string; profilePhotoUrl?: string; isAnonymous?: boolean };
  starRating?: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE' | string;
  comment?: string;
  createTime?: string;
  updateTime?: string;
  reviewReply?: { comment?: string; updateTime?: string };
};

export type ReviewsOrder = 'updateTime desc' | 'rating desc' | 'rating';

export type ReviewsSettings = {
  account_name: string;
  location_name: string;
  location_title: string;
  location_address: string | null;
  place_id: string | null;
  order_by: ReviewsOrder;
  enabled: number;
  updated_at: string;
};

export type ReviewsResponse = {
  reviews?: GoogleReview[];
  averageRating?: number;
  totalReviewCount?: number;
  nextPageToken?: string;
};

type GoogleError = { error?: string | { message?: string; status?: string }; error_description?: string };

export class GoogleBusinessProfileError extends Error {
  constructor(message: string, public status = 502) {
    super(message);
    this.name = 'GoogleBusinessProfileError';
  }
}

let cachedAccessToken: { value: string; expiresAt: number } | null = null;

function getCredentials() {
  const { env } = getRequestContext();
  const clientId = env.GBP_CLIENT_ID;
  const clientSecret = env.GBP_CLIENT_SECRET;
  const refreshToken = env.GBP_REFRESH_TOKEN;
  const missing = [
    !clientId && 'GBP_CLIENT_ID',
    !clientSecret && 'GBP_CLIENT_SECRET',
    !refreshToken && 'GBP_REFRESH_TOKEN',
  ].filter(Boolean);

  if (missing.length) {
    throw new GoogleBusinessProfileError(`Faltan secretos de Cloudflare: ${missing.join(', ')}.`, 503);
  }
  return { clientId: clientId!, clientSecret: clientSecret!, refreshToken: refreshToken! };
}

export function isAccountName(value: unknown): value is string {
  return typeof value === 'string' && /^accounts\/[A-Za-z0-9_-]+$/.test(value);
}

export function isLocationName(value: unknown): value is string {
  return typeof value === 'string' && /^accounts\/[A-Za-z0-9_-]+\/locations\/[A-Za-z0-9_-]+$/.test(value);
}

export function isReviewsOrder(value: unknown): value is ReviewsOrder {
  return value === 'updateTime desc' || value === 'rating desc' || value === 'rating';
}

async function googleErrorMessage(response: Response) {
  const body = await response.json().catch(() => null) as GoogleError | null;
  const raw = typeof body?.error === 'string' ? body.error : body?.error?.message;
  return body?.error_description || raw || `Google respondió HTTP ${response.status}.`;
}

export async function getBusinessProfileAccessToken() {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now() + 60_000) {
    return cachedAccessToken.value;
  }

  const { clientId, clientSecret, refreshToken } = getCredentials();
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new GoogleBusinessProfileError(`No se pudo renovar la autorización de Google: ${await googleErrorMessage(response)}`, response.status);
  }

  const result = await response.json() as { access_token?: string; expires_in?: number };
  if (!result.access_token) throw new GoogleBusinessProfileError('Google no devolvió un access token.');
  cachedAccessToken = {
    value: result.access_token,
    expiresAt: Date.now() + Math.max(60, result.expires_in ?? 3600) * 1000,
  };
  return result.access_token;
}

export async function googleBusinessProfileFetch<T>(url: string): Promise<T> {
  const accessToken = await getBusinessProfileAccessToken();
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new GoogleBusinessProfileError(await googleErrorMessage(response), response.status);
  }
  return response.json() as Promise<T>;
}

export async function listBusinessAccounts(): Promise<BusinessAccount[]> {
  const accounts: BusinessAccount[] = [];
  let pageToken = '';
  for (let page = 0; page < 10; page += 1) {
    const query = new URLSearchParams({ pageSize: '20' });
    if (pageToken) query.set('pageToken', pageToken);
    const result = await googleBusinessProfileFetch<{ accounts?: BusinessAccount[]; nextPageToken?: string }>(
      `https://mybusinessaccountmanagement.googleapis.com/v1/accounts?${query}`,
    );
    accounts.push(...(result.accounts ?? []));
    if (!result.nextPageToken) break;
    pageToken = result.nextPageToken;
  }
  return accounts;
}

export async function listBusinessLocations(accountName: string): Promise<BusinessLocation[]> {
  if (!isAccountName(accountName)) throw new GoogleBusinessProfileError('Selecciona una cuenta válida.', 400);
  const accountId = accountName.slice('accounts/'.length);
  const locations: BusinessLocation[] = [];
  let pageToken = '';
  for (let page = 0; page < 20; page += 1) {
    const query = new URLSearchParams({
      readMask: 'name,title,storefrontAddress,metadata',
      pageSize: '100',
    });
    if (pageToken) query.set('pageToken', pageToken);
    const result = await googleBusinessProfileFetch<{ locations?: BusinessLocation[]; nextPageToken?: string }>(
      `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${encodeURIComponent(accountId)}/locations?${query}`,
    );
    locations.push(...(result.locations ?? []));
    if (!result.nextPageToken) break;
    pageToken = result.nextPageToken;
  }
  return locations;
}

export async function listLocationReviews(
  locationName: string,
  orderBy: ReviewsOrder,
  pageToken?: string,
): Promise<ReviewsResponse> {
  if (!isLocationName(locationName)) throw new GoogleBusinessProfileError('Selecciona una ubicación válida.', 400);
  if (!isReviewsOrder(orderBy)) throw new GoogleBusinessProfileError('El orden de reseñas no es válido.', 400);
  const query = new URLSearchParams({ pageSize: '50', orderBy });
  if (pageToken && pageToken.length <= 2048) query.set('pageToken', pageToken);
  return googleBusinessProfileFetch<ReviewsResponse>(
    `https://mybusiness.googleapis.com/v4/${locationName}/reviews?${query}`,
  );
}

export async function getReviewsSettings() {
  const { env } = getRequestContext();
  const row = await env.DB.prepare(
    'SELECT account_name, location_name, location_title, location_address, place_id, order_by, enabled, updated_at FROM google_reviews_settings WHERE id = 1',
  ).first<ReviewsSettings>();
  return row;
}
