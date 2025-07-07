import Form from '@/app/ui/sites/create-form';

export default async function Page(props: {
  searchParams?: Promise<{ customerId?: string }>
}) {
  const searchParams = await props.searchParams;
  const customerId = searchParams?.customerId || '';
  return (
    <main>
      <Form customerId={customerId} />
    </main>
  );
}