import Link from 'next/link';
import { fetchRequerimientoById,fetchSiteById, fetchCustomerSICCById } from '@/app/lib/data';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string; siteId?: string; customerId?: string }>;
}) {
  const params = await searchParams;
  const id = params?.id || '';
  const siteId = params?.siteId || '';
  const customerId = params?.customerId || '';
  const requerimiento = id ? await fetchRequerimientoById(id) : null;
  const site = siteId ? await fetchSiteById(siteId) : null;
  const customer = customerId ? await fetchCustomerSICCById(customerId) : null;
  return (
    <main className="p-6 space-y-4">
      <div className="mb-6 rounded-md bg-green-100 p-4 text-sm text-green-800">
        Alta del Requerimiento <strong>{requerimiento?.nombre || ''}</strong> para del Site <strong>{site?.nombre || ''}</strong> para el cliente{' '}
        <strong>{customer?.name || ''}</strong> registrada con éxito.
      </div>
      <div className="flex gap-4">
          <Link prefetch={false} href="/dashboard/customersSICC" className="underline">
          Volver
        </Link>
        <Link
          prefetch={false}
          href={`/dashboard/customersSICC/sites/requerimientos?siteId=${siteId}`}
          className="underline"
        >
          Crear Requerimiento
        </Link>
      </div>
    </main>
  );
}