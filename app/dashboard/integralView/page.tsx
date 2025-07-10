export const dynamic = 'force-dynamic';

import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import { getCustomers, fetchCustomerById } from '@/app/lib/data';
import { Suspense } from 'react';
import SitesList from '@/app/ui/integralView/SitesList';
import { SiteSkeleton } from '@/app/ui/integralView/skeletons';

export default async function Page(props: { searchParams?: Promise<{ query?: string; customerId?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const customerId = searchParams?.customerId;

  if (!customerId) {
    const customers = await getCustomers(query, 1);
    return (
      <div className="p-4 text-[11px]">
        <h1 className={`${lusitana.className} text-base mb-4`}>Elegir Cliente</h1>
        <div className="mb-4 flex gap-2">
          <Search placeholder="Buscar clientes..." />
        </div>
        <ul className="divide-y">
          {customers.map((c) => (
            <li key={c.id} className="py-2">
              <a href={`/dashboard/integralView?customerId=${c.id}`} className="hover:underline">
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const customer = await fetchCustomerById(customerId);
  if (!customer) {
    return <p className="p-4">Cliente no encontrado</p>;
  }



  return (
    <div className="p-4 text-[10px] space-y-4">
      <h1 className={`${lusitana.className} text-lg`}>Cliente: {customer.name}</h1>
      <p>CUIT: {customer.CUIT} - Estado: {customer.status}</p>
      <Suspense fallback={<SiteSkeleton />}>
        <SitesList customerId={customerId} />
      </Suspense>
    </div>
  );
}