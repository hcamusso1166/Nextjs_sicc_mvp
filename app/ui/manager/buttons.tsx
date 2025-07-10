import { PlusIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateSiteManager({ customerId }: { customerId: string }) {
  return (
    <Link
      href={`/dashboard/manager/sites?customerId=${customerId}`}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Crear Site</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
  }

export function CreateRequerimientoManager({
  siteId,
  customerId,
}: {
  siteId: string;
  customerId: string;
}) {
  return (
    <Link
      href={`/dashboard/manager/sites/requerimientos?siteId=${siteId}&customerId=${customerId}`}
      className="flex h-6 items-center rounded bg-blue-600 px-2 text-xs font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Crear Requerimiento</span>{' '}
      <PlusIcon className="h-4 md:ml-2" />
    </Link>
  );
}

export function CreateProveedorManager({
  reqId,
  siteId,
  customerId,
}: {
  reqId: string;
  siteId: string;
  customerId: string;
}) {
  return (
    <Link
      href={`/dashboard/manager/sites/requerimientos/proveedores?reqId=${reqId}&siteId=${siteId}&customerId=${customerId}`}
      className="flex h-6 items-center rounded bg-blue-600 px-2 text-xs font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Crear Proveedor</span>{' '}
      <PlusIcon className="h-4 md:ml-2" />
    </Link>
  );
  }

export function CrearDocsRequeridosButton({
  reqId,
  siteId,
  customerId,
}: {
  reqId: string;
  siteId: string;
  customerId: string;
}) {
  return (
    <Link
      href={`/dashboard/manager/sites/requerimientos/proveedores/create-docs?reqId=${reqId}&siteId=${siteId}&customerId=${customerId}`}
      className="flex h-6 items-center rounded bg-blue-600 px-2 text-xs font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Crear Documentos Requeridos</span>{' '}
      <DocumentPlusIcon className="h-4 md:ml-2" />
    </Link>
  );
}