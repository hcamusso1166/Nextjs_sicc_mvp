import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import RefreshLink from '@/app/ui/refresh-link';
import { deleteCustomerSICC } from '@/app/lib/actions';

export function CreateCustomerSICC() {
  return (
    <RefreshLink
      href="/dashboard/customersSICC/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Crear Cliente</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </RefreshLink>
  );
}

export function DeleteCustomerSICC({ id }: { id: string }) {
  const deleteCustomerWithId = deleteCustomerSICC.bind(null, id);
  return (
    <form action={deleteCustomerWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export function UpdateCustomerSICC({ id }: { id: string }) {
  return (
    <RefreshLink
      href={`/dashboard/customersSICC/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </RefreshLink>
  );
}