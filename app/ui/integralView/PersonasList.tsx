import {
  fetchPersonasByProveedor,
  fetchDocumentosByPersona,
  fetchParametroDocumento,
  fetchTipoDocumento,
} from '@/app/lib/data';
import PersonasTable from '@/app/ui/integralView/PersonasTable';
import DocumentosPersonasTable from '@/app/ui/integralView/DocumentosPersonasTable';

export default async function PersonasList({ provId, personasRaw }: { provId?: string; personasRaw?: any[] }) {
  const list = personasRaw ?? (provId ? await fetchPersonasByProveedor(provId) : []);
  const personas = await Promise.all(
    list.map(async (per: any) => {
      const docPerRaw = await fetchDocumentosByPersona(per.id);
      const documentos = await Promise.all(
        docPerRaw.map(async (d: any) => {
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
      return { ...per, documentos };
    })
  );
  if (!personas.length) return null;
  return (
    <div>
      <h5 className="underline">Personas</h5>
      <PersonasTable personas={personas} />
      {personas.map(
        (per: any) =>
          per.documentos?.length > 0 && (
            <div key={per.id} className="ml-4">
              <h6 className="italic">Documentos de {per.nombre}</h6>
              <DocumentosPersonasTable documentos={per.documentos} />
            </div>
          )
      )}
    </div>
  );
}