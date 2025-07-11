import { lusitana } from '@/app/ui/fonts';
import { fetchDocReqProveedorCounts } from '@/app/lib/data';
import DocReqProveedorChart from './docreq-proveedor-chart';

export default async function DocReqProveedor() {
  const data = await fetchDocReqProveedorCounts();
  if (!data || data.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }
  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Documentos por Estado
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <DocReqProveedorChart data={data} />
      </div>
    </div>
  );
}