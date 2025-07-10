import CreateProveedorForm from '@/app/ui/proveedores/create-form';
import { createProveedorManager } from '@/app/lib/actions';
import { fetchCustomerById, fetchSiteById, fetchRequerimientoById } from '@/app/lib/data';
import { lusitana } from '@/app/ui/fonts';

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

  if (!customer || !site || !req) {
    return <p className="p-4">Datos no encontrados</p>;
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className={`${lusitana.className} text-lg`}>
        Cliente: {customer.name} - Site: {site.nombre} - Requerimiento: {req.nombre}
      </h1>
      <CreateProveedorForm
        requerimientoId={reqId}
        customerId={customerId}
        siteId={siteId}
        action={createProveedorManager}
        cancelHref={`/dashboard/manager?customerId=${customerId}`}
      />
    </main>
  );
}