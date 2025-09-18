export const dynamic = 'force-dynamic';
import Pagination from '@/app/ui/customersSICC/pagination';
import CustomersSICCTable from '@/app/ui/customersSICC/table';
import { CreateCustomerSICC } from '@/app/ui/customersSICC/buttons';
import Search from '@/app/ui/search';
import { fetchCustomersSICCPages } from '@/app/lib/data';
import { Suspense } from 'react';
import { lusitana } from '@/app/ui/fonts';


export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchCustomersSICCPages(query);
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Clientes</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar clientes..." />
        <CreateCustomerSICC />
      </div>
      <Suspense key={query + currentPage} fallback={<div>Loading...</div>}>
        <CustomersSICCTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}