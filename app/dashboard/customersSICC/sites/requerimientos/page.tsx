import CreateRequerimientoForm from '@/app/ui/requerimientos/create-form';

export default async function Page({
     searchParams 
    }: { 
        searchParams?: Promise<{ siteId?: string } > ;
    }) {
  const params = await searchParams;
  const siteId = params?.siteId || '';
  return (
    <main className="p-6">
      <CreateRequerimientoForm siteId={siteId} />
    </main>
  );
}