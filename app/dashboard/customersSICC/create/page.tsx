import Breadcrumbs from '@/app/ui/customersSICC/breadcrumbs';
import Form from '@/app/ui/customersSICC/create-form';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clientes', href: '/dashboard/customersSICC' },
          { label: 'Crear Cliente', href: '/dashboard/customersSICC/create', active: true },
        ]}
      />
      <Form />
    </main>
  );
}