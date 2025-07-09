import React from 'react';

export interface Persona {
  id: string;
  nombre?: string;
  apellido?: string;
  DNI?: number;
  status?: string;
}

export default function PersonasTable({ personas }: { personas: Persona[] }) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-md bg-gray-50 p-2">
          <table className="min-w-full text-gray-900 text-[10px]">
            <thead className="bg-gray-50 text-left font-normal">
              <tr>
                <th className="px-3 py-2 font-medium">Nombre</th>
                <th className="px-3 py-2 font-medium">Apellido</th>
                <th className="px-3 py-2 font-medium">DNI</th>
                <th className="px-3 py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {personas.map((p) => (
                <tr key={p.id}>
                  <td className="whitespace-nowrap px-3 py-2">{p.nombre}</td>
                  <td className="whitespace-nowrap px-3 py-2">{p.apellido}</td>
                  <td className="whitespace-nowrap px-3 py-2">{p.DNI}</td>
                  <td className="whitespace-nowrap px-3 py-2">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}