import Form from '@/app/ui/sites/create-form';
import { createSiteManager } from '@/app/lib/actions';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ customerId?: string }>;
}) {
  const params = await searchParams;
  const customerId = params?.customerId || '';
  return (
    <main>
      <Form
        customerId={customerId}
        action={createSiteManager}
        cancelHref={`/dashboard/IntegralManager?customerId=${customerId}`}
      />
    </main>
  );
}