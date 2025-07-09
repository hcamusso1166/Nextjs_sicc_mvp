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
  fetchDocumentosByProveedor,
  fetchParametroDocumento,
  fetchTipoDocumento,
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
  documentos: any[];
  status?: string;
}

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; customerId?: string }>;
}) {
    const searchParams = await props.searchParams;
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
              const docsRaw = await fetchDocumentosByProveedor(prov.id);
              const documentos = await Promise.all(
                docsRaw.map(async (d: any) => {
                  const param = await fetchParametroDocumento(d.idParametro);
                  let nombreDocumento = '';
                  let tipoDocumento = '';
                  if (param?.idTipoDocumento) {
                    tipoDocumento = param.idTipoDocumento;
                    const tipo = await fetchTipoDocumento(param.idTipoDocumento);
                    if (tipo?.nombreDocumento) {
                      nombreDocumento = tipo.nombreDocumento;
                    }
                  }
                  return {
                    ...d,
                    TipoDeDocumento: tipoDocumento,
                    Documento: nombreDocumento,
                  };
                })
              );
              return {
                id: prov.id,
                nombre: prov.nombre,
                CUIT: prov.CUIT,
                personas,
                vehiculos,
                documentos,
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
    <div className="p-4 text-[10px] space-y-4">
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
              {req.proveedores.length > 0 && (
                <div className="ml-4 mt-1">
                  <h4 className="font-medium">Proveedores</h4>
                  {req.proveedores.map((prov) => (
                    <div key={prov.id} className="ml-4 mt-2 space-y-1">
                                            <div className="overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                          <div className="overflow-hidden rounded-md bg-gray-50 p-2">
                            <table className="min-w-full text-gray-900 text-[10px]">
                              <thead className="bg-gray-50 text-left font-normal">
                                <tr>
                                  <th className="px-3 py-2 font-medium">Nombre</th>
                                  <th className="px-3 py-2 font-medium">CUIT</th>
                                  <th className="px-3 py-2 font-medium">Estado</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                <tr>
                                  <td className="whitespace-nowrap px-3 py-2">{prov.nombre}</td>
                                  <td className="whitespace-nowrap px-3 py-2">{prov.CUIT}</td>
                                  <td className="whitespace-nowrap px-3 py-2">{prov.status}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      {prov.documentos.length > 0 && (
                        <div>
                          <h5 className="underline">Documentos</h5>
                          <div className="overflow-x-auto">
                            <div className="inline-block min-w-full align-middle">
                              <div className="overflow-hidden rounded-md bg-gray-50 p-2">
                                <table className="min-w-full text-gray-900 text-[10px]">
                                  <thead className="bg-gray-50 text-left font-normal">
                                    <tr>
                                      <th className="px-3 py-2 font-medium">Estado</th>
                                      <th className="px-3 py-2 font-medium">Tipo</th>
                                      <th className="px-3 py-2 font-medium">Documento</th>
                                      <th className="px-3 py-2 font-medium">Fecha Pres.</th>
                                      <th className="px-3 py-2 font-medium">Validez</th>
                                      <th className="px-3 py-2 font-medium">Próxima</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 bg-white">
                                    {prov.documentos.map((d: any) => (
                                      <tr key={d.id}>
                                        <td className="whitespace-nowrap px-3 py-2">{d.status}</td>
                                        <td className="whitespace-nowrap px-3 py-2">{d.TipoDeDocumento}</td>
                                        <td className="whitespace-nowrap px-3 py-2">{d.Documento}</td>
                                        <td className="whitespace-nowrap px-3 py-2">{d.fechaPresentacion}</td>
                                        <td className="whitespace-nowrap px-3 py-2">{d.validezDias}</td>
                                        <td className="whitespace-nowrap px-3 py-2">{d.proximaFechaPresentacion}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {prov.personas.length > 0 && (
                        <div>
                          <h5 className="underline">Personas</h5>
                          <div className="overflow-x-auto">
                            <div className="inline-block min-w-full align-middle">
                              <div className="overflow-hidden rounded-md bg-gray-50 p-2">
                                <table className="min-w-full text-gray-900 text-[10px]">
                                  <thead className="bg-gray-50 text-left font-normal">
                                    <tr>
                                      <th className="px-3 py-2 font-medium">Nombre</th>
                                      <th className="px-3 py-2 font-medium">Apellido</th>
                                      <th className="px-3 py-2 font-medium">DNI</th>
                                      <th className="px-3 py-2 font-medium">Estado</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 bg-white">
                                    {prov.personas.map((p: any) => (
                                      <tr key={p.id}>
                                        <td className="whitespace-nowrap px-3 py-2">{p.nombre}</td>
                                        <td className="whitespace-nowrap px-3 py-2">{p.apellido}</td>
                                        <td className="whitespace-nowrap px-3 py-2">{p.DNI}</td>
                                        <td className="whitespace-nowrap px-3 py-2">{p.status}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      

                      {prov.vehiculos.length > 0 && (
                        <div>
                          <h5 className="underline">Vehículos</h5>
                          <div className="overflow-x-auto">
                            <div className="inline-block min-w-full align-middle">
                              <div className="overflow-hidden rounded-md bg-gray-50 p-2">
                                <table className="min-w-full text-gray-900 text-[10px]">
                                  <thead className="bg-gray-50 text-left font-normal">
                                    <tr>
                                      <th className="px-3 py-2 font-medium">Dominio</th>
                                      <th className="px-3 py-2 font-medium">Marca</th>
                                      <th className="px-3 py-2 font-medium">Modelo</th>
                                      <th className="px-3 py-2 font-medium">Color</th>
                                      <th className="px-3 py-2 font-medium">Estado</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 bg-white">
                                    {prov.vehiculos.map((v: any) => (
                                      <tr key={v.id}>
                                        <td className="whitespace-nowrap px-3 py-2">{v.dominio}</td>
                                        <td className="whitespace-nowrap px-3 py-2">{v.marca}</td>
                                        <td className="whitespace-nowrap px-3 py-2">{v.modelo}</td>
                                        <td className="whitespace-nowrap px-3 py-2">{v.color}</td>
                                        <td className="whitespace-nowrap px-3 py-2">{v.status}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}