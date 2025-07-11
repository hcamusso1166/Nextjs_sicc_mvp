import Link from 'next/link';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { fetchDocsAPresentar } from '@/app/lib/data';

export default async function DocsAPresentar() {
  const docs = await fetchDocsAPresentar();
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Documentos a Presentar
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {docs.map((doc, i) => (
            <Link
              href={`/dashboard/manager?customerId=${doc.clienteId}`}
              key={doc.id}
              className={clsx('block py-4', { 'border-t': i !== 0 })}
            >
              <p className="truncate text-sm font-semibold md:text-base">
                {doc.cliente} - {doc.site}
              </p>
              <p className="text-sm text-gray-500">
                {doc.requerimiento} - {doc.proveedor} ({doc.tipo})
              </p>
            </Link>
          ))}
          {docs.length === 0 && (
            <p className="py-4 text-sm text-gray-500">No hay documentos pendientes.</p>
          )}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">Actualizado ahora</h3>
        </div>
      </div>
    </div>
  );
}