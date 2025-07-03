import Pagination from '@/app/ui/customersSICC/pagination';
import CustomersSICCTable from '@/app/ui/customersSICC/table';
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
      <Suspense key={query + currentPage} fallback={<div>Loading...</div>}>
        <CustomersSICCTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}