import Link from 'next/link';
import { fetchCustomerSICCById } from '@/app/lib/data';

export default async function Page({ searchParams }: { searchParams: { id?: string } }) {
  const id = searchParams?.id || '';
  const customer = id ? await fetchCustomerSICCById(id) : null;
  return (
    <main className="p-4 md:p-6">
      <div className="mb-6 rounded-md bg-green-100 p-4 text-sm text-green-800">
        Alta del Cliente <strong>{customer?.name || ''}</strong> registrada con éxito.
      </div>
      <div className="flex gap-4">
        <Link href="/dashboard/customersSICC" className="rounded bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-500">Volver</Link>
        {id && (
          <Link href={`/dashboard/customersSICC/sites?customerId=${id}`} className="rounded bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-500">Crear SITE</Link>
        )}
      </div>
    </main>
  );
}