import { Suspense } from 'react';
import {
  fetchPersonasByProveedor,
  fetchVehiculosByProveedor,
  fetchDocumentosByProveedor,
  fetchParametroDocumento,
  fetchTipoDocumento,
} from '@/app/lib/data';
import ProveedorTable from '@/app/ui/integralView/ProveedorTable';
import DocumentosTable from '@/app/ui/integralView/DocumentosTable';
import PersonasList from './PersonasList';
import VehiculosList from './VehiculosList';
import { PersonaSkeleton, VehiculoSkeleton } from '@/app/ui/integralView/skeletons';

export default async function ProveedorItem({ proveedor }: { proveedor: any }) {
  const [personasRaw, vehiculosRaw, docsRaw] = await Promise.all([
    fetchPersonasByProveedor(proveedor.id),
    fetchVehiculosByProveedor(proveedor.id),
    fetchDocumentosByProveedor(proveedor.id),
  ]);

  const documentos = await Promise.all(
    docsRaw.map(async (d: any) => {
      const param = await fetchParametroDocumento(d.idParametro);
      let nombreDocumento = '';
      let tipoDocumento = '';
      if (param?.idTipoDocumento) {
        tipoDocumento = param.idTipoDocumento;
        const tipo = await fetchTipoDocumento(param.idTipoDocumento);
        if (tipo?.nombreDocumento) {
          nombreDocumento = tipo.nombreDocumento;
        }
      }
      return { ...d, TipoDeDocumento: tipoDocumento, Documento: nombreDocumento };
    })
  );

  return (
    <div className="ml-4 mt-2 space-y-1 border-2">
      <ProveedorTable proveedor={proveedor} />
      {documentos.length > 0 && (
        <div>
          <h5 className="underline">Documentos</h5>
          <DocumentosTable documentos={documentos} />
        </div>
      )}
      <Suspense fallback={<PersonaSkeleton />}>
        <PersonasList personasRaw={personasRaw} />
      </Suspense>
      <Suspense fallback={<VehiculoSkeleton />}>
        <VehiculosList vehiculosRaw={vehiculosRaw} />
      </Suspense>
    </div>
  );
}