import CreateRequerimientoForm from '@/app/ui/requerimientos/create-form';
import { createRequerimientoManager } from '@/app/lib/actions';
import { fetchCustomerById, fetchSiteById } from '@/app/lib/data';
import { lusitana } from '@/app/ui/fonts';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ siteId?: string; customerId?: string }>;
}) {
  const params = await searchParams;
  const siteId = params?.siteId || '';
  const customerId = params?.customerId || '';
  const [site, customer] = await Promise.all([
    siteId ? fetchSiteById(siteId) : Promise.resolve(null),
  customerId ? fetchCustomerById(customerId) : Promise.resolve(null),
  ]);

  if (!customer || !site) {
    return <p className="p-4">Datos no encontrados</p>;
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className={`${lusitana.className} text-lg`}>
        Cliente: {customer.name} - Site: {site.nombre}
      </h1>
      <CreateRequerimientoForm
        siteId={siteId}
        customerId={customerId}
        action={createRequerimientoManager}
        cancelHref={`/dashboard/manager?customerId=${customerId}`}
      />
    </main>
  );
}