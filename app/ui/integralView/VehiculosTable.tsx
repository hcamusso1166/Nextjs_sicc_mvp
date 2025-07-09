import React from 'react';

export interface Vehiculo {
  id: string;
  dominio: string;
  marca?: string;
  modelo?: string;
  color?: string;
  status?: string;
}

export default function VehiculosTable({ vehiculos }: { vehiculos: Vehiculo[] }) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-md bg-gray-50 p-2">
          <table className="min-w-full text-gray-900 text-[10px]">
            <thead className="bg-gray-50 text-left font-normal">
              <tr>
                <th className="px-3 py-2 font-medium">Dominio</th>
                <th className="px-3 py-2 font-medium">Marca</th>
                <th className="px-3 py-2 font-medium">Modelo</th>
                <th className="px-3 py-2 font-medium">Color</th>
                <th className="px-3 py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {vehiculos.map((v) => (
                <tr key={v.id}>
                  <td className="whitespace-nowrap px-3 py-2">{v.dominio}</td>
                  <td className="whitespace-nowrap px-3 py-2">{v.marca}</td>
                  <td className="whitespace-nowrap px-3 py-2">{v.modelo}</td>
                  <td className="whitespace-nowrap px-3 py-2">{v.color}</td>
                  <td className="whitespace-nowrap px-3 py-2">{v.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}