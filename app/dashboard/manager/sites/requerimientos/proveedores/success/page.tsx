import Link from 'next/link';
import { fetchProveedorById, fetchRequerimientoById, fetchSiteById, fetchCustomerById } from '@/app/lib/data';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string; reqId?: string; siteId?: string; customerId?: string }>;
}) {
  const params = await searchParams;
  const id = params?.id || '';
  const reqId = params?.reqId || '';
  const siteId = params?.siteId || '';
  const customerId = params?.customerId || '';
  const [prov, req, site, customer] = await Promise.all([
    id ? fetchProveedorById(id) : Promise.resolve(null),
    reqId ? fetchRequerimientoById(reqId) : Promise.resolve(null),
    siteId ? fetchSiteById(siteId) : Promise.resolve(null),
    customerId ? fetchCustomerById(customerId) : Promise.resolve(null),
  ]);

  return (
    <main className="p-6 space-y-4">
      <div className="mb-6 rounded-md bg-green-100 p-4 text-sm text-green-800">
        Alta del Proveedor <strong>{prov?.nombre || ''}</strong> para el Requerimiento{' '}
        <strong>{req?.nombre || ''}</strong> del Site <strong>{site?.nombre || ''}</strong>{' '}
        para el cliente <strong>{customer?.name || ''}</strong> registrada con éxito.
      </div>
      <div className="flex gap-4">
        <Link href={`/dashboard/manager?customerId=${customerId}`} className="underline">
          Volver
        </Link>
        <Link
          href={`/dashboard/manager/sites/requerimientos/proveedores?reqId=${reqId}&siteId=${siteId}&customerId=${customerId}`}
          className="underline"
        >
          Crear Proveedor
        </Link>
      </div>
    </main>
  );
}