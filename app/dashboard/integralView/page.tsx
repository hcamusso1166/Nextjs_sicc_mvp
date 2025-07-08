export const dynamic = 'force-dynamic';

import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import {
  getCustomers,
  fetchCustomerById,
  fetchSitesByCustomer,
  fetchRequerimientosBySite,
  fetchProveedoresByRequerimiento,
  fetchPersonasByProveedor,
  fetchVehiculosByProveedor,
} from '@/app/lib/data';

interface SiteTree {
  id: string;
  nombre?: string;
  fechaInicio?: string;
  requerimientos: RequerimientoTree[];
}

interface RequerimientoTree {
  id: string;
  nombre?: string;
  fechaInicio?: string;
  proveedores: ProveedorTree[];
}

interface ProveedorTree {
  id: string;
  nombre?: string;
  CUIT?: string;
  personas: any[];
  vehiculos: any[];
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { query?: string; customerId?: string };
}) {
  const query = searchParams?.query || '';
  const customerId = searchParams?.customerId;

  if (!customerId) {
    const customers = await getCustomers(query, 1);
    return (
      <div className="p-4 text-[11px]">
        <h1 className={`${lusitana.className} text-base mb-4`}>Elegir Cliente</h1>
        <div className="mb-4 flex gap-2">
          <Search placeholder="Buscar clientes..." />
        </div>
        <ul className="divide-y">
          {customers.map((c) => (
            <li key={c.id} className="py-2">
              <a href={`/dashboard/integralView?customerId=${c.id}`} className="hover:underline">
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const customer = await fetchCustomerById(customerId);
  if (!customer) {
    return <p className="p-4">Cliente no encontrado</p>;
  }

  const sitesRaw = await fetchSitesByCustomer(customerId);
  const sites: SiteTree[] = await Promise.all(
    sitesRaw.map(async (site) => {
      const reqsRaw = await fetchRequerimientosBySite(site.id);
      const requerimientos: RequerimientoTree[] = await Promise.all(
        reqsRaw.map(async (req) => {
          const provsRaw = await fetchProveedoresByRequerimiento(req.id);
          const proveedores: ProveedorTree[] = await Promise.all(
            provsRaw.map(async (prov) => {
              const personas = await fetchPersonasByProveedor(prov.id);
              const vehiculos = await fetchVehiculosByProveedor(prov.id);
              return {
                id: prov.id,
                nombre: prov.nombre,
                CUIT: prov.CUIT,
                personas,
                vehiculos,
              };
            })
          );
          return {
            id: req.id,
            nombre: req.nombre,
            fechaInicio: req.fechaInicio,
            proveedores,
        };
        })
      );
      return { id: site.id, nombre: site.nombre, requerimientos };
    })
  );

  return (
    <div className="p-4 text-[11px] space-y-4">
      <h1 className={`${lusitana.className} text-lg`}>Cliente: {customer.name}</h1>
      <p>CUIT: {customer.CUIT} - Estado: {customer.status}</p>
      {sites.map((site) => (
        <div key={site.id} className="border rounded p-2">
          <h2 className="font-semibold">Site: {site.nombre}</h2>
          {site.requerimientos.map((req) => (
            <div key={req.id} className="ml-4 mt-2">
              <h3 className="font-medium">Requerimiento: {req.nombre}</h3>
                {req.fechaInicio && (
                <p className="ml-2">Fecha de Inicio: {req.fechaInicio}</p>
              )}
              {req.proveedores.map((prov) => (
                <div key={prov.id} className="ml-4 mt-1">
                  <h4 className="font-medium">Proveedor: {prov.nombre}</h4>
                  {prov.CUIT && <p className="ml-2">CUIT: {prov.CUIT}</p>}
                  {prov.personas.length > 0 && (
                    <div className="ml-4">
                      <h5 className="underline">Personas</h5>
                      <ul className="list-disc ml-5">
                        {prov.personas.map((p: any) => (
                          <li key={p.id}>
                            {p.nombre} {p.apellido} - DNI {p.DNI} ({p.status})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {prov.vehiculos.length > 0 && (
                    <div className="ml-4 mt-1">
                      <h5 className="underline">Vehículos</h5>
                      <ul className="list-disc ml-5">
                        {prov.vehiculos.map((v: any) => (
                          <li key={v.id}>
                            {v.dominio} {v.marca} {v.modelo} {v.color} ({v.status})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}