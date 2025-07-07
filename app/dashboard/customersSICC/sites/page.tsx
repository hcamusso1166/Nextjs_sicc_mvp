import Form from '@/app/ui/sites/create-form';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ customerId?: string }>;
}) {
  const params = await searchParams;
  const customerId = params?.customerId || '';
  return (
    <main>
      <Form customerId={customerId} />
    </main>
  );
}