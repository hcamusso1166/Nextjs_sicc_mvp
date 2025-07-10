import Form from '@/app/ui/sites/create-form';
import { createSiteManager } from '@/app/lib/actions';
import { fetchCustomerById } from '@/app/lib/data';
import { lusitana } from '@/app/ui/fonts';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ customerId?: string }>;
}) {
  const params = await searchParams;
  const customerId = params?.customerId || '';
  const customer = customerId ? await fetchCustomerById(customerId) : null;
  if (!customer) {
    return <p className="p-4">Cliente no encontrado</p>;
  }
  return (
    <main className="p-6 space-y-4">
      <h1 className={`${lusitana.className} text-lg`}>Cliente: {customer.name}</h1>
      <Form
        customerId={customerId}
        action={createSiteManager}
        cancelHref={`/dashboard/manager?customerId=${customerId}`}
      />
    </main>
  );
}