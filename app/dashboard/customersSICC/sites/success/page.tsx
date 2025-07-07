import Link from 'next/link';
import { fetchSiteById, fetchCustomerSICCById } from '@/app/lib/data';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string; customerId?: string }>;
}) {
  const params = await searchParams;
  const id = params?.id || '';
  const customerId = params?.customerId || '';
  const site = id ? await fetchSiteById(id) : null;
  const customer = customerId ? await fetchCustomerSICCById(customerId) : null;

  return (
    <main className="p-4 md:p-6">
      <div className="mb-6 rounded-md bg-green-100 p-4 text-sm text-green-800">
        Alta del SITE <strong>{site?.nombre || ''}</strong> para el cliente{' '}
        <strong>{customer?.name || ''}</strong> registrada con éxito.
      </div>
      <div className="flex gap-4">
        <Link href="/dashboard/customersSICC" className="rounded bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-500">Volver</Link>
        {customerId && (
          <Link href={`/dashboard/customersSICC/sites?customerId=${customerId}`} className="rounded bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-500">Crear Site</Link>
        )}
        <Link href={`/dashboard/customersSICC/sites/requerimientos?siteId=${id}`} className="underline">Crear Requerimiento</Link>
      </div>
    </main>
  );
}