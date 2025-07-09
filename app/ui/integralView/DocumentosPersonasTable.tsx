import React from 'react';
import DocumentoStatus from './status';

export interface DocumentoPersona {
  id: string;
  status?: string;
  TipoDeDocumento?: string;
  Documento?: string;
  fechaPresentacion?: string;
  validezDias?: number;
  proximaFechaPresentacion?: string | null;
}

export default function DocumentosPersonasTable({ documentos }: { documentos: DocumentoPersona[] }) {
  return (
    <div className="overflow-x-auto border-2">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-md bg-gray-50 p-2">
          <table className="min-w-full text-gray-900 text-[10px]">
            <thead className="bg-gray-50 text-left font-normal">
              <tr>
                <th className="px-3 py-2 font-medium">Estado</th>
                <th className="px-3 py-2 font-medium">Tipo</th>
                <th className="px-3 py-2 font-medium">Documento</th>
                <th className="px-3 py-2 font-medium">Fecha Pres.</th>
                <th className="px-3 py-2 font-medium">Validez</th>
                <th className="px-3 py-2 font-medium">Próxima</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {documentos.map((d) => (
                <tr key={d.id}>
                  <td className="whitespace-nowrap px-3 py-2">
                    <DocumentoStatus status={d.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">{d.TipoDeDocumento}</td>
                  <td className="whitespace-nowrap px-3 py-2">{d.Documento}</td>
                  <td className="whitespace-nowrap px-3 py-2">{d.fechaPresentacion}</td>
                  <td className="whitespace-nowrap px-3 py-2">{d.validezDias}</td>
                  <td className="whitespace-nowrap px-3 py-2">{d.proximaFechaPresentacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}