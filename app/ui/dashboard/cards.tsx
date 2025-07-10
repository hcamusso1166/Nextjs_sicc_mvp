import { fetchDashboardCounts } from '@/app/lib/data';
import { UserGroupIcon, HomeIcon, ClipboardDocumentListIcon, TruckIcon,} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

const iconMap = {
  clientes: UserGroupIcon,
  sites: HomeIcon,
  requerimientos: ClipboardDocumentListIcon,
  proveedores: TruckIcon,
};

export default async function CardWrapper() {
  const { clientes, sites, requerimientos, proveedores } =
    await fetchDashboardCounts();
  return (
    <>
      <Card title="Clientes" value={clientes} type="clientes" />
      <Card title="Sites" value={sites} type="sites" />
      <Card title="Requerimientos" value={requerimientos} type="requerimientos" />
      <Card title="Proveedores" value={proveedores} type="proveedores" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'clientes' | 'sites' | 'requerimientos' | 'proveedores';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
