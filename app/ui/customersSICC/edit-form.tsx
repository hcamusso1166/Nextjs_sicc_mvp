
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateCustomerSICC } from '@/app/lib/actions';
import { DirectusCustomer } from '@/app/lib/definitions';

export default function Form({ customer }: { customer: DirectusCustomer }) {
  const updateCustomer = updateCustomerSICC.bind(null, customer.id);
  return (
    <form action={updateCustomer}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6 grid grid-cols-1 gap-4 md:grid-cols-2 text-xs">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={customer.name}
            className="block w-full rounded-md border border-gray-200 p-2"
          />
        </div>
        <div>
          <label htmlFor="CUIT" className="mb-2 block text-sm font-medium">
            CUIT
          </label>
          <input
            id="CUIT"
            name="CUIT"
            type="text"
            defaultValue={customer.CUIT}
            className="block w-full rounded-md border border-gray-200 p-2"
          />
        </div>
        <div>
          <label htmlFor="contacto" className="mb-2 block text-sm font-medium">
            Contacto
          </label>
          <input
            id="contacto"
            name="contacto"
            type="text"
            defaultValue={customer.contacto}
            className="block w-full rounded-md border border-gray-200 p-2"
          />
        </div>
        <div>
          <label htmlFor="mail" className="mb-2 block text-sm font-medium">
            Mail
          </label>
          <input
            id="mail"
            name="mail"
            type="email"
            defaultValue={customer.mail}
            className="block w-full rounded-md border border-gray-200 p-2"
          />
        </div>
        <div>
          <label htmlFor="tel" className="mb-2 block text-sm font-medium">
            Tel
          </label>
          <input
            id="tel"
            name="tel"
            type="text"
            defaultValue={customer.tel}
            className="block w-full rounded-md border border-gray-200 p-2"
          />
        </div>
        <div>
          <label htmlFor="mailNotif" className="mb-2 block text-sm font-medium">
            Mail Notif
          </label>
          <input
            id="mailNotif"
            name="mailNotif"
            type="email"
            defaultValue={customer.mailNotif}
            className="block w-full rounded-md border border-gray-200 p-2"
          />
        </div>
        <div>
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Estado
          </label>
          <select
            id="status"
            name="status"
            className="block w-full rounded-md border border-gray-200 p-2"
            defaultValue={customer.status}
          >
            <option value="Publicado">Publicado</option>
            <option value="Borrador">Borrador</option>
            <option value="Archivado">Archivado</option>
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Link
          href={`/dashboard/customersSICC/sites?customerId=${customer.id}`}
          className="rounded bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-500"
        >
          Crear SITE
        </Link>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customersSICC"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Guardar Cambios</Button>
      </div>
    </form>
  );
}