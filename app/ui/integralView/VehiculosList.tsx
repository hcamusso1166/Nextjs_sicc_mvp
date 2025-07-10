import {
  fetchVehiculosByProveedor,
  fetchDocumentosByVehiculo,
  fetchParametroDocumento,
  fetchTipoDocumento,
} from '@/app/lib/data';
import VehiculosTable from '@/app/ui/integralView/VehiculosTable';
import DocumentosVehiculosTable from '@/app/ui/integralView/DocumentosVehiculosTable';

export default async function VehiculosList({ provId, vehiculosRaw }: { provId?: string; vehiculosRaw?: any[] }) {
  const list = vehiculosRaw ?? (provId ? await fetchVehiculosByProveedor(provId) : []);
  const vehiculos = await Promise.all(
    list.map(async (veh: any) => {
      const docVehRaw = await fetchDocumentosByVehiculo(veh.id);
      const documentos = await Promise.all(
        docVehRaw.map(async (d: any) => {
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
      return { ...veh, documentos };
    })
  );
  if (!vehiculos.length) return null;
  return (
    <div>
      <h5 className="underline">Vehículos</h5>
      <VehiculosTable vehiculos={vehiculos} />
      {vehiculos.map(
        (veh: any) =>
          veh.documentos?.length > 0 && (
            <div key={veh.id} className="ml-4">
              <h6 className="italic">Documentos de {veh.dominio}</h6>
              <DocumentosVehiculosTable documentos={veh.documentos} />
            </div>
          )
      )}
    </div>
  );
}