import { fetchProveedoresByRequerimiento } from '@/app/lib/data';
import { Suspense } from 'react';
import ProveedorItem from '@/app/ui/integralView/ProveedorItem';
import { ProveedorSkeleton } from '@/app/ui/integralView/skeletons';
import { CrearDocsRequeridosButton } from '@/app/ui/manager/buttons';

export default async function ProveedoresListManager({
  reqId,
  siteId,
  customerId,
}: {
  reqId: string;
  siteId: string;
  customerId: string;
}) {
  const proveedores = await fetchProveedoresByRequerimiento(reqId);
  if (!proveedores.length) return null;
  return (
    <div className="ml-4 mt-1">
      <div className="flex items-center gap-2">
        <h4 className="font-medium">Proveedores:</h4>
        <CrearDocsRequeridosButton
          reqId={reqId}
          siteId={siteId}
          customerId={customerId}
        />
      </div>
      {proveedores.map((prov) => (
        <Suspense key={prov.id} fallback={<ProveedorSkeleton />}>
          <ProveedorItem proveedor={prov} />
        </Suspense>
      ))}
    </div>
  );
}