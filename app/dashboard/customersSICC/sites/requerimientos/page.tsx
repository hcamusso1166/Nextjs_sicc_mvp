import CreateRequerimientoForm from '@/app/ui/requerimientos/create-form';

export default async function Page({
  searchParams,
}: {
  searchParams?: { siteId?: string };
}) {
  const siteId = searchParams?.siteId || '';
  return (
    <main className="p-6">
      <CreateRequerimientoForm siteId={siteId} />
    </main>
  );
}