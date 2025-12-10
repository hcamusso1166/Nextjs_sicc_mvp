export const revalidate = 0;
import { fetchSitesByCustomer } from '@/app/lib/data';
import { Suspense } from 'react';
import RequerimientosListManager from './RequerimientosListManager';
import { RequerimientoSkeleton } from '@/app/ui/integralView/skeletons';
import { CreateRequerimientoManager } from '@/app/ui/manager/buttons';

export default async function SitesListManager({
  customerId,
}: {
  customerId: string;
}) {
  const sites = await fetchSitesByCustomer(customerId);
  if (!sites.length) return <p>No hay sitios</p>;
  return (
    <>
      {sites.map((site) => (
        <div key={site.id} className="border-4 rounded p-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Site: {site.nombre}</h2>
            <CreateRequerimientoManager
              siteId={site.id}
              customerId={customerId}
            />
          </div>
          <Suspense fallback={<RequerimientoSkeleton />}>
            <RequerimientosListManager
              siteId={site.id}
              customerId={customerId}
            />
          </Suspense>
        </div>
      ))}
    </>
  );
}