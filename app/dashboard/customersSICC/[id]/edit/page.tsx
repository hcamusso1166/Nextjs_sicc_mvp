import Breadcrumbs from '@/app/ui/customersSICC/breadcrumbs';
import Form from '@/app/ui/customersSICC/edit-form';
import { fetchCustomerSICCById } from '@/app/lib/data';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const customer = await fetchCustomerSICCById(id);
  if (!customer) return <p>No se encontró el cliente</p>;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clientes', href: '/dashboard/customersSICC' },
          { label: 'Editar Cliente', href: `/dashboard/customersSICC/${id}/edit`, active: true },
        ]}
      />
      <Form customer={customer} />
    </main>
  );
}