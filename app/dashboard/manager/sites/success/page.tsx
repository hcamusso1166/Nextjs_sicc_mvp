import Link from 'next/link';
import { fetchSiteById, fetchCustomerById } from '@/app/lib/data';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string; customerId?: string }>;
}) {
  const params = await searchParams;
  const id = params?.id || '';
  const customerId = params?.customerId || '';
  const site = id ? await fetchSiteById(id) : null;
  const customer = customerId ? await fetchCustomerById(customerId) : null;
  return (
    <main className="p-6 space-y-4">
      <div className="mb-6 rounded-md bg-green-100 p-4 text-sm text-green-800">
        Alta del SITE <strong>{site?.nombre || ''}</strong> para el cliente{' '}
        <strong>{customer?.name || ''}</strong> registrada con éxito.
      </div>
      <div className="flex gap-4">
        <Link href={`/dashboard/manager?customerId=${customerId}`} className="underline">Volver</Link>
        <Link href={`/dashboard/manager/sites?customerId=${customerId}`} className="underline">Crear nuevo Site</Link>
      </div>
    </main>
  );
}