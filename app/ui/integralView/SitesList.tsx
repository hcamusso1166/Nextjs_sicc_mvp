import { fetchSitesByCustomer } from '@/app/lib/data';
import { Suspense } from 'react';
import RequerimientosList from './RequerimientosList';
import { RequerimientoSkeleton } from '@/app/ui/integralView/skeletons';

export default async function SitesList({ customerId }: { customerId: string }) {
  const sites = await fetchSitesByCustomer(customerId);
  if (!sites.length) return <p>No hay sitios</p>;
  return (
    <>
      {sites.map((site) => (
        <div key={site.id} className="border-4 rounded p-2">
          <h2 className="font-semibold">Site: {site.nombre}</h2>
          <Suspense fallback={<RequerimientoSkeleton />}> 
            <RequerimientosList siteId={site.id} />
          </Suspense>
        </div>
      ))}
    </>
  );
}