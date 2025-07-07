import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
import Form from '@/app/ui/customers/create-form';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clientes', href: '/dashboard/customers' },
          { label: 'Crear Cliente', href: '/dashboard/customers/create', active: true },
        ]}
      />
      <Form />
    </main>
  );
}