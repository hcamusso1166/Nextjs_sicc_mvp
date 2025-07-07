import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
import Form from '@/app/ui/customers/edit-form';
import { fetchCustomerById } from '@/app/lib/data';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const customer = await fetchCustomerById(id);
  if (!customer) return <p>No se encontró el cliente</p>;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clientes', href: '/dashboard/customers' },
          { label: 'Editar Cliente', href: `/dashboard/customers/${id}/edit`, active: true },
        ]}
      />
      <Form customer={customer} />
    </main>
  );
}