import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import { getCustomersSICC  } from '@/app/lib/data';

export default async function CustomersSICCTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const customers = await getCustomersSICC(query, currentPage);

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
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      ID
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Nombre
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900 bg-white">
                  {customers.map((customer: any) => (
                    <tr key={customer.id} className="group">
                      <td className="whitespace-nowrap py-5 pl-6 pr-3 text-sm">
                        {customer.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm">
                        {customer.name}
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