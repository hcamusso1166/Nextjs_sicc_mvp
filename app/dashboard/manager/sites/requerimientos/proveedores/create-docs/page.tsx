import Link from 'next/link';
import {
  fetchRequerimientoById,
  fetchSiteById,
  fetchCustomerById,
} from '@/app/lib/data';
import { generarDocumentosRequeridos } from '@/app/lib/actions';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ reqId?: string; siteId?: string; customerId?: string }>;
}) {
  const params = await searchParams;
  const reqId = params?.reqId || '';
  const siteId = params?.siteId || '';
  const customerId = params?.customerId || '';
  const [req, site, customer] = await Promise.all([
    reqId ? fetchRequerimientoById(reqId) : Promise.resolve(null),
    siteId ? fetchSiteById(siteId) : Promise.resolve(null),
    customerId ? fetchCustomerById(customerId) : Promise.resolve(null),
  ]);
  const resultados = reqId ? await generarDocumentosRequeridos(reqId) : [];
  return (
    <main className="p-6 space-y-4 text-sm">
      <div className="mb-6 rounded-md bg-green-100 p-4 text-green-800">
        {resultados.length > 0
          ? `Se generaron documentos para ${resultados.length} proveedores del requerimiento ${req?.nombre ?? ''} del site ${site?.nombre ?? ''} del cliente ${customer?.name ?? ''}.`
          : 'No se generaron documentos.'}
      </div>
      <div className="flex gap-4">
        <Link href={`/dashboard/manager?customerId=${customerId}`} className="underline">
          Volver
        </Link>
      </div>
    </main>
  );
}