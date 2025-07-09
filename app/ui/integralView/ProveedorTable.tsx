import React from 'react';

export interface Proveedor {
  id: string;
  nombre?: string;
  CUIT?: string;
  status?: string;
}

export default function ProveedorTable({ proveedor }: { proveedor: Proveedor }) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-md bg-gray-50 p-2">
          <table className="min-w-full text-gray-900 text-[10px]">
            <thead className="bg-gray-50 text-left font-normal">
              <tr>
                <th className="px-3 py-2 font-medium">Nombre</th>
                <th className="px-3 py-2 font-medium">CUIT</th>
                <th className="px-3 py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="whitespace-nowrap px-3 py-2">{proveedor.nombre}</td>
                <td className="whitespace-nowrap px-3 py-2">{proveedor.CUIT}</td>
                <td className="whitespace-nowrap px-3 py-2">{proveedor.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}