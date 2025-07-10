import { fetchProveedoresByRequerimiento } from '@/app/lib/data';
import { Suspense } from 'react';
import ProveedorItem from './ProveedorItem';
import { ProveedorSkeleton } from '@/app/ui/integralView/skeletons';

export default async function ProveedoresList({ reqId }: { reqId: string }) {
  const proveedores = await fetchProveedoresByRequerimiento(reqId);
  if (!proveedores.length) return null;
  return (
    <div className="ml-4 mt-1">
      <h4 className="font-medium">Proveedores</h4>
      {proveedores.map((prov) => (
        <Suspense key={prov.id} fallback={<ProveedorSkeleton />}>
          <ProveedorItem proveedor={prov} />
        </Suspense>
      ))}
    </div>
  );
}