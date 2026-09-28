'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  BusinessAccount,
  BusinessLocation,
  GoogleReview,
  ReviewsOrder,
  ReviewsResponse,
  ReviewsSettings as SavedSettings,
} from '@/lib/google-business-profile';

type Message = { kind: 'success' | 'error' | 'info'; text: string };

function reviewLocationName(accountName: string, location: BusinessLocation) {
  return location.name.startsWith('locations/') ? `${accountName}/${location.name}` : location.name;
}

function ratingNumber(rating?: string) {
  return ({ ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 } as Record<string, number>)[rating || ''] || 0;
}

function displayDate(value?: string) {
  if (!value) return 'Fecha no disponible';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Fecha no disponible' : new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium' }).format(date);
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: 'no-store', headers: { 'Content-Type': 'application/json', ...init?.headers } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Error HTTP ${response.status}`);
  return data as T;
}

export default function ReviewsSettings() {
  const [accounts, setAccounts] = useState<BusinessAccount[]>([]);
  const [locations, setLocations] = useState<BusinessLocation[]>([]);
  const [accountName, setAccountName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [orderBy, setOrderBy] = useState<ReviewsOrder>('updateTime desc');
  const [enabled, setEnabled] = useState(true);
  const [preview, setPreview] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState('');
  const [message, setMessage] = useState<Message | null>(null);
  const [savedSettings, setSavedSettings] = useState<SavedSettings | null>(null);

  const selectedLocation = useMemo(
    () => locations.find((location) => reviewLocationName(accountName, location) === locationName),
    [locations, accountName, locationName],
  );

  useEffect(() => {
    let active = true;
    async function initialize() {
      setLoading('initialize');
      try {
        const [{ settings }, { accounts: accountResults }] = await Promise.all([
          requestJson<{ settings: SavedSettings | null }>('/api/admin/reviews/settings'),
          requestJson<{ accounts: BusinessAccount[] }>('/api/admin/reviews/accounts'),
        ]);
        if (!active) return;
        setSavedSettings(settings);
        setAccounts(accountResults || []);
        if (settings) {
          setAccountName(settings.account_name);
          setLocationName(settings.location_name);
          setOrderBy(settings.order_by);
          setEnabled(Boolean(settings.enabled));
          try {
            const { locations: locationResults } = await requestJson<{ locations: BusinessLocation[] }>(
              `/api/admin/reviews/locations?accountName=${encodeURIComponent(settings.account_name)}`,
            );
            if (!active) return;
            setLocations(locationResults || []);
          } catch (error) {
            if (active) setMessage({ kind: 'error', text: error instanceof Error ? error.message : 'No se pudieron cargar las ubicaciones.' });
          }
        } else if (accountResults?.length) {
          setMessage({ kind: 'info', text: 'Elige la cuenta y la ubicación que mostrarás en la portada.' });
        }
      } catch (error) {
        if (active) setMessage({ kind: 'error', text: error instanceof Error ? error.message : 'No se pudo iniciar la configuración.' });
      } finally {
        if (active) setLoading('');
      }
    }
    void initialize();
    return () => { active = false; };
  }, []);

  async function refreshAccounts() {
    setLoading('accounts');
    setMessage(null);
    try {
      const result = await requestJson<{ accounts: BusinessAccount[] }>('/api/admin/reviews/accounts');
      setAccounts(result.accounts || []);
      setLocations([]);
      setLocationName('');
      setPreview(null);
      setMessage({ kind: 'success', text: `Se encontraron ${result.accounts?.length || 0} cuenta(s) de Perfil de Negocio.` });
    } catch (error) {
      setMessage({ kind: 'error', text: error instanceof Error ? error.message : 'No se pudieron consultar las cuentas.' });
    } finally {
      setLoading('');
    }
  }

  async function loadLocations() {
    if (!accountName) return;
    setLoading('locations');
    setMessage(null);
    setLocations([]);
    setLocationName('');
    setPreview(null);
    try {
      const result = await requestJson<{ locations: BusinessLocation[] }>(
        `/api/admin/reviews/locations?accountName=${encodeURIComponent(accountName)}`,
      );
      setLocations(result.locations || []);
      setMessage({ kind: 'success', text: `Se encontraron ${result.locations?.length || 0} ubicación(es).` });
    } catch (error) {
      setMessage({ kind: 'error', text: error instanceof Error ? error.message : 'No se pudieron consultar las ubicaciones.' });
    } finally {
      setLoading('');
    }
  }

  async function loadPreview(pageToken?: string) {
    if (!locationName) return;
    setLoading(pageToken ? 'more' : 'preview');
    setMessage(null);
    try {
      const query = new URLSearchParams({ locationName, orderBy });
      if (pageToken) query.set('pageToken', pageToken);
      const result = await requestJson<ReviewsResponse>(`/api/admin/reviews/preview?${query}`);
      setPreview((previous) => pageToken
        ? { ...result, reviews: [...(previous?.reviews || []), ...(result.reviews || [])] }
        : result);
      setMessage({ kind: 'success', text: `${result.reviews?.length || 0} reseñas recibidas en esta página; ${result.totalReviewCount || 0} en total.` });
    } catch (error) {
      setMessage({ kind: 'error', text: error instanceof Error ? error.message : 'No se pudieron consultar las reseñas.' });
    } finally {
      setLoading('');
    }
  }

  async function saveSettings() {
    if (!selectedLocation) {
      setMessage({ kind: 'error', text: 'Selecciona primero una ubicación válida.' });
      return;
    }
    setLoading('save');
    setMessage(null);
    const address = [
      ...(selectedLocation.storefrontAddress?.addressLines || []),
      selectedLocation.storefrontAddress?.locality,
      selectedLocation.storefrontAddress?.administrativeArea,
    ].filter(Boolean).join(', ');
    try {
      await requestJson('/api/admin/reviews/settings', {
        method: 'PUT',
        body: JSON.stringify({
          accountName,
          locationName,
          locationTitle: selectedLocation.title || selectedLocation.name,
          locationAddress: address,
          placeId: selectedLocation.metadata?.placeId || '',
          orderBy,
          enabled,
        }),
      });
      const { settings } = await requestJson<{ settings: SavedSettings }>('/api/admin/reviews/settings');
      setSavedSettings(settings);
      setMessage({ kind: 'success', text: 'Configuración guardada. La portada usará esta cuenta y ubicación.' });
    } catch (error) {
      setMessage({ kind: 'error', text: error instanceof Error ? error.message : 'No se pudo guardar la configuración.' });
    } finally {
      setLoading('');
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-800">Panel de administración</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Reseñas de Google</h1>
        <p className="mt-2 max-w-3xl text-gray-600">Selecciona la cuenta y ubicación de Perfil de Negocio que se mostrarán en la portada. Las credenciales permanecen en los secretos de Cloudflare.</p>
      </header>

      {message && (
        <div role={message.kind === 'error' ? 'alert' : 'status'} className={`rounded-lg border p-4 text-sm ${message.kind === 'error' ? 'border-red-200 bg-red-50 text-red-800' : message.kind === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-blue-200 bg-blue-50 text-blue-800'}`}>
          {message.text}
        </div>
      )}

      <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Cuenta y ubicación</h2>
          <p className="mt-1 text-sm text-gray-500">La cuenta autorizada debe tener acceso de administrador o propietario a la ficha.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <label className="block space-y-2 text-sm font-medium text-gray-700">
            Cuenta de Perfil de Negocio
            <select value={accountName} onChange={(event) => { setAccountName(event.target.value); setLocations([]); setLocationName(''); setPreview(null); }} className="block min-h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900">
              <option value="">Selecciona una cuenta</option>
              {accounts.map((account) => <option key={account.name} value={account.name}>{account.accountName || account.name} · {account.name}</option>)}
            </select>
          </label>
          <button type="button" onClick={refreshAccounts} disabled={!!loading} className="min-h-11 rounded-md border border-amber-800 px-4 py-2 font-medium text-amber-900 hover:bg-amber-50 disabled:opacity-50">
            {loading === 'accounts' ? 'Consultando…' : 'Actualizar cuentas'}
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <label className="block space-y-2 text-sm font-medium text-gray-700">
            Ubicación del negocio
            <select value={locationName} onChange={(event) => { setLocationName(event.target.value); setPreview(null); }} className="block min-h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900">
              <option value="">Selecciona una ubicación</option>
              {locations.map((location) => {
                const resourceName = reviewLocationName(accountName, location);
                const address = [
                  ...(location.storefrontAddress?.addressLines || []),
                  location.storefrontAddress?.locality,
                ].filter(Boolean).join(', ');
                return <option key={resourceName} value={resourceName}>{location.title || resourceName}{address ? ` — ${address}` : ''}</option>;
              })}
            </select>
          </label>
          <button type="button" onClick={loadLocations} disabled={!accountName || !!loading} className="min-h-11 rounded-md border border-amber-800 px-4 py-2 font-medium text-amber-900 hover:bg-amber-50 disabled:opacity-50">
            {loading === 'locations' ? 'Buscando…' : 'Listar ubicaciones'}
          </button>
        </div>

        <label className="block max-w-lg space-y-2 text-sm font-medium text-gray-700">
          Orden de las reseñas
          <select value={orderBy} onChange={(event) => { setOrderBy(event.target.value as ReviewsOrder); setPreview(null); }} className="block min-h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900">
            <option value="updateTime desc">Última actualización</option>
            <option value="rating desc">Mejor puntuación primero</option>
            <option value="rating">Menor puntuación primero</option>
          </select>
          <span className="block text-xs font-normal text-gray-500">Google ofrece estos órdenes; la portada usa la selección guardada aquí.</span>
        </label>

        <label className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
          <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} className="mt-0.5 h-4 w-4 accent-amber-800" />
          <span><strong className="block text-gray-900">Mostrar reseñas en la portada</strong><span>Si desactivas esta opción, el bloque público se ocultará sin borrar la cuenta ni la ubicación seleccionadas.</span></span>
        </label>

        <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
          <button type="button" onClick={() => loadPreview()} disabled={!locationName || !!loading} className="min-h-11 rounded-md bg-amber-900 px-5 py-2 font-semibold text-white hover:bg-amber-950 disabled:opacity-50">
            {loading === 'preview' ? 'Consultando reseñas…' : 'Consultar vista previa'}
          </button>
          <button type="button" onClick={saveSettings} disabled={!selectedLocation || !!loading} className="min-h-11 rounded-md border border-gray-300 bg-white px-5 py-2 font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50">
            {loading === 'save' ? 'Guardando…' : 'Guardar configuración'}
          </button>
          {savedSettings && <span className="self-center text-sm text-gray-500">Guardado: {savedSettings.location_title}</span>}
        </div>
      </section>

      {preview && (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Vista previa</h2>
              <p className="mt-1 text-sm text-gray-500">★ {preview.averageRating?.toFixed(1) || '0.0'} · {preview.totalReviewCount || 0} reseñas en Google · {preview.reviews?.length || 0} cargadas</p>
            </div>
            {preview.nextPageToken && <button type="button" onClick={() => loadPreview(preview.nextPageToken)} disabled={!!loading} className="rounded-md border border-amber-800 px-4 py-2 text-sm font-medium text-amber-900 disabled:opacity-50">{loading === 'more' ? 'Cargando…' : 'Cargar siguientes 50'}</button>}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(preview.reviews || []).slice(0, 6).map((review: GoogleReview, index) => (
              <article key={review.name || `${review.createTime}-${index}`} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong className="truncate text-sm text-gray-900">{review.reviewer?.displayName || 'Usuario de Google'}</strong>
                  <span className="shrink-0 text-amber-600" aria-label={`${ratingNumber(review.starRating)} de 5 estrellas`}>{'★'.repeat(ratingNumber(review.starRating))}{'☆'.repeat(5 - ratingNumber(review.starRating))}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{displayDate(review.createTime)}</p>
                <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-gray-700">{review.comment?.trim() || 'Esta reseña no incluye un comentario escrito.'}</p>
              </article>
            ))}
          </div>
          {!preview.reviews?.length && <p className="mt-5 text-sm text-gray-600">La ubicación no devolvió reseñas.</p>}
        </section>
      )}
    </div>
  );
}
