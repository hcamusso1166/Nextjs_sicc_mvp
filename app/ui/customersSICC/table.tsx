import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import { getCustomersSICC } from '@/app/lib/data';
import { DirectusCustomer } from '@/app/lib/definitions';

export default async function CustomersSICCTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const customers = await getCustomersSICC<DirectusCustomer>(query, currentPage);

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>Clientes</h1>
      <Search placeholder="Buscar clientes..." />
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <table className="min-w-full text-gray-900">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    
                    <th scope="col" className="px-3 py-5 font-medium">
                      Estado
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Nombre
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      CUIT
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Contacto
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Mail
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Tel
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Mail Notif
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900 bg-white">
                  {customers.map((customer: DirectusCustomer) => (
                    <tr key={customer.id} className="group">
                      <td className="whitespace-nowrap px-3 py-5 text-sm">
                        {customer.status}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm">
                        {customer.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm">
                        {customer.CUIT}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm">
                        {customer.contacto}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm">
                        {customer.mail}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm">
                        {customer.tel}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm">
                        {customer.mailNotif}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}