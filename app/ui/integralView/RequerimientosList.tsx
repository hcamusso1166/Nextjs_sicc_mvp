import { fetchRequerimientosBySite } from '@/app/lib/data';
import { Suspense } from 'react';
import ProveedoresList from './ProveedoresList';
import { ProveedorSkeleton } from '@/app/ui/integralView/skeletons';

export default async function RequerimientosList({ siteId }: { siteId: string }) {
  const requerimientos = await fetchRequerimientosBySite(siteId);
  if (!requerimientos.length) return null;
  return (
    <>
      {requerimientos.map((req) => (
        <div key={req.id} className="ml-4 mt-2 border-[3px]">
          <h3 className="font-medium">Requerimiento: {req.nombre}</h3>
          {req.fechaInicio && <p className="ml-2">Fecha de Inicio: {req.fechaInicio}</p>}
          <Suspense fallback={<ProveedorSkeleton />}>
            <ProveedoresList reqId={req.id} />
          </Suspense>
        </div>
      ))}
    </>
  );
}