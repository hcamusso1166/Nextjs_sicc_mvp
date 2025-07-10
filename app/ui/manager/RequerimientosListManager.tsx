import { fetchRequerimientosBySite } from '@/app/lib/data';
import { Suspense } from 'react';
import ProveedoresListManager from './ProveedoresListManager';
import { ProveedorSkeleton } from '@/app/ui/integralView/skeletons';
import { CreateProveedorManager } from '@/app/ui/manager/buttons';

export default async function RequerimientosListManager({
  siteId,
  customerId,
}: {
  siteId: string;
  customerId: string;
}) {
  const requerimientos = await fetchRequerimientosBySite(siteId);
  if (!requerimientos.length) return null;
  return (
    <>
      {requerimientos.map((req) => (
        <div key={req.id} className="ml-4 mt-2 border-[3px]">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Requerimiento: {req.nombre}</h3>
            <CreateProveedorManager
              reqId={req.id}
              siteId={siteId}
              customerId={customerId}
            />
          </div>
          {req.fechaInicio && (
            <p className="ml-2">Fecha de Inicio: {req.fechaInicio}</p>
          )}
          <Suspense fallback={<ProveedorSkeleton />}>
            <ProveedoresListManager
              reqId={req.id}
              siteId={siteId}
              customerId={customerId}
            />
          </Suspense>
        </div>
      ))}
    </>
  );
}