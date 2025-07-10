import CreateRequerimientoForm from '@/app/ui/requerimientos/create-form';
import { createRequerimientoManager } from '@/app/lib/actions';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ siteId?: string; customerId?: string }>;
}) {
  const params = await searchParams;
  const siteId = params?.siteId || '';
  const customerId = params?.customerId || '';
  return (
    <main className="p-6">
      <CreateRequerimientoForm
        siteId={siteId}
        customerId={customerId}
        action={createRequerimientoManager}
        cancelHref={`/dashboard/manager?customerId=${customerId}`}
      />
    </main>
  );
}