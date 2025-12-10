import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  DirectusCustomer,
  DirectusListResponse,
  DirectusSite,
  DirectusRequerimiento,
  DirectusProveedor,
  DirectusParametroDocumentoProveedor,
  DirectusTipoDocumento,
  DirectusDocumentoRequerido,
} from './definitions';
import { directusFetch, formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
export const DIRECTUS_URL =
  process.env.DIRECTUS_URL || 'https://tto.com.ar';

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}
export async function fetchDashboardCounts() {
  try {
    const endpoints = [
      { url: `${DIRECTUS_URL}/items/Clientes?limit=1&meta=filter_count`, tag: 'customersSICC' },
      { url: `${DIRECTUS_URL}/items/sites?limit=1&meta=filter_count`, tag: 'sites' },
      { url: `${DIRECTUS_URL}/items/requerimiento?limit=1&meta=filter_count`, tag: 'requerimientos' },
      { url: `${DIRECTUS_URL}/items/proveedor?limit=1&meta=filter_count`, tag: 'proveedores' },
    ];

    const responses = await Promise.all(
      endpoints.map((e) =>
        directusFetch(e.url, {
          cache: 'no-store',
          next: { tags: [e.tag] },
          logContext: `fetchDashboardCounts:${e.tag}`,
        }),
      ),
    );

    const counts = await Promise.all(
      responses.map(async (res) => {
        if (!res.ok) return 0;
        const data: DirectusListResponse<any> = await res.json();
        return data?.meta?.filter_count ?? 0;
      }),
    );

    const [clientes, sites, requerimientos, proveedores] = counts;

    return { clientes, sites, requerimientos, proveedores };
  } catch (error) {
    console.error('Failed to fetch dashboard counts:', error);
    return { clientes: 0, sites: 0, requerimientos: 0, proveedores: 0 };
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}
export async function getCustomersSICC<T extends DirectusCustomer = DirectusCustomer>(
  query = "",
  currentPage = 1,
): Promise<T[]> {
  const url = `${DIRECTUS_URL}/items/Clientes?page=${currentPage}&limit=${ITEMS_PER_PAGE}&sort=name${query ? `&filter[name][_contains]=${encodeURIComponent(query)}` : ''}`;
  try {
    const res = await directusFetch(url, {
            cache: 'no-store',
      next: { tags: ['customersSICC'] },
      logContext: 'getCustomersSICC',
    });
    if (!res.ok) throw new Error("Error al obtener clientes");
    const data: DirectusListResponse<T> = await res.json();
    return data.data;
  } catch (err) {
    console.error("Error al hacer fetch de clientes:", err);
    return [];
  }
}

export async function fetchCustomerSICCById<T extends DirectusCustomer = DirectusCustomer>(id: string): Promise<T | null> {
  try {
    const res = await directusFetch(`${DIRECTUS_URL}/items/Clientes/${id}`, {
      cache: 'no-store',
      next: { tags: ['customersSICC'] , revalidate: 0 },
      logContext: 'fetchCustomerSICCById',
    });
    if (!res.ok) throw new Error('Error al obtener cliente');
    const data: { data: T } = await res.json();
    return data.data;
  } catch (err) {
    console.error('Error al hacer fetch de cliente:', err);
    return null;
  }
}
export async function fetchSiteById<T extends DirectusSite = DirectusSite>(id: string): Promise<T | null> {
  try {
    const res = await directusFetch(`${DIRECTUS_URL}/items/sites/${id}`, {
      cache: 'no-store',
      next: { tags: ['sites'] , revalidate: 0 },
      logContext: 'fetchSiteById',
    });
    if (!res.ok) throw new Error('Error al obtener site');
    const data: { data: T } = await res.json();
    return data.data;
  } catch (err) {
    console.error('Error al hacer fetch de site:', err);
    return null;
  }
}
export async function fetchRequerimientoById<T extends DirectusSite = DirectusSite>(id: string): Promise<T | null> {
  try {
    const res = await directusFetch(`${DIRECTUS_URL}/items/requerimiento/${id}`, {
      cache: 'no-store',
      next: { tags: ['requerimientos'], revalidate: 0 },
      logContext: 'fetchRequerimientoById',
    });
    if (!res.ok) throw new Error('Error al obtener site');
    const data: { data: T } = await res.json();
    return data.data;
  } catch (err) {
    console.error('Error al hacer fetch de site:', err);
    return null;
  }
}

export async function fetchSitesByCustomer<T extends DirectusSite = DirectusSite>(customerId: string): Promise<T[]> {
  const url = `${DIRECTUS_URL}/items/sites?filter%5BidCliente%5D%5B_eq%5D=${customerId}`;
  try {
    const res = await directusFetch(url, { cache: 'no-store', next: { tags: ['sites'] }, logContext: 'fetchSitesByCustomer' });
    if (!res.ok) throw new Error('Error al obtener sites');
    const data: DirectusListResponse<T> = await res.json();
    return data.data;
  } catch (err) {
    console.error('Error al hacer fetch de sites:', err);
    return [];
  }
}

export async function fetchRequerimientosBySite<T extends DirectusRequerimiento = DirectusRequerimiento>(siteId: string): Promise<T[]> {
  const url = `${DIRECTUS_URL}/items/requerimiento?filter%5BidSites%5D%5B_eq%5D=${siteId}`;
  try {
    const res = await directusFetch(url, { cache: 'no-store', next: { tags: ['requerimientos'] }, logContext: 'fetchRequerimientosBySite' });
    if (!res.ok) throw new Error('Error al obtener requerimientos');
    const data: DirectusListResponse<T> = await res.json();
    return data.data;
  } catch (err) {
    console.error('Error al hacer fetch de requerimientos:', err);
    return [];
  }
}

export async function fetchProveedoresByRequerimiento<T extends DirectusProveedor = DirectusProveedor>(reqId: string): Promise<T[]> {
  const url = `${DIRECTUS_URL}/items/proveedor?filter%5BidRequerimientos%5D%5B_eq%5D=${reqId}`;
  try {
    const res = await directusFetch(url, { cache: 'no-store', next: { tags: ['proveedores'] }, logContext: 'fetchProveedoresByRequerimiento' });
    if (!res.ok) throw new Error('Error al obtener proveedores');
    const data: DirectusListResponse<T> = await res.json();
    return data.data;
  } catch (err) {
    console.error('Error al hacer fetch de proveedores:', err);
    return [];
  }
}
export async function fetchProveedorById<T extends DirectusProveedor = DirectusProveedor>(id: string): Promise<T | null> {
  try {
    const res = await directusFetch(`${DIRECTUS_URL}/items/proveedor/${id}`, {
      cache: 'no-store',
      next: { tags: ['proveedores'] },
      logContext: 'fetchProveedorById',
    });
    if (!res.ok) throw new Error('Error al obtener proveedor');
    const data: { data: T } = await res.json();
    return data.data;
  } catch (err) {
    console.error('Error al hacer fetch de proveedor:', err);
    return null;
  }
}

export async function fetchPersonasByProveedor<T = any>(provId: string): Promise<T[]> {
  const url = `${DIRECTUS_URL}/items/persona?filter%5BidProveedor%5D%5B_eq%5D=${provId}`;
  try {
    const res = await directusFetch(url, { cache: 'no-store', next: { tags: ['personas'] }, logContext: 'fetchPersonasByProveedor' });
    if (!res.ok) throw new Error('Error al obtener personas');
    const data: DirectusListResponse<T> = await res.json();
    return data.data;
  } catch (err) {
    console.error('Error al hacer fetch de personas:', err);
    return [];
  }
}

export async function fetchVehiculosByProveedor<T = any>(provId: string): Promise<T[]> {
  const url = `${DIRECTUS_URL}/items/vehiculo?filter%5BidProveedor%5D%5B_eq%5D=${provId}`;
  try {
    const res = await directusFetch(url, { cache: 'no-store', next: { tags: ['vehiculos'] }, logContext: 'fetchVehiculosByProveedor' });
    if (!res.ok) throw new Error('Error al obtener vehiculos');
    const data: DirectusListResponse<T> = await res.json();
    return data.data;
  } catch (err) {
    console.error('Error al hacer fetch de vehiculos:', err);
    return [];
  }
}
export async function fetchDocumentosByProveedor<T = any>(provId: string): Promise<T[]> {
  const url = `${DIRECTUS_URL}/items/DocumentosRequeridos?filter%5BidProveedor%5D%5B_eq%5D=${provId}`;
  try {
    const res = await directusFetch(url, { cache: 'no-store', next: { tags: ['documentos'] }, logContext: 'fetchDocumentosByProveedor' });
    if (!res.ok) throw new Error('Error al obtener documentos');
    const data: DirectusListResponse<T> = await res.json();
    return data.data;
  } catch (err) {
    console.error('Error al hacer fetch de documentos:', err);
    return [];
  }
}
export async function fetchDocumentosByPersona<T = any>(personaId: string): Promise<T[]> {
  const url = `${DIRECTUS_URL}/items/documentosRequeridosPersonas/${personaId}`;
  try {
    const res = await directusFetch(url, { cache: 'no-store', next: { tags: ['documentospersona']}, logContext: 'fetchDocumentosByPersona' });
    if (!res.ok) throw new Error('Error al obtener documentos de persona');
    const data: any = await res.json();
    const docs = Array.isArray(data.data) ? data.data : data.data ? [data.data] : [];
    return docs as T[];
  } catch (err) {
    console.error('Error al hacer fetch de documentos de persona:', err);
    return [];
  }
}

export async function fetchDocumentosByVehiculo<T = any>(vehiculoId: string): Promise<T[]> {
  const url = `${DIRECTUS_URL}/items/documentosRequeridosVehiculos/${vehiculoId}`;
  try {
    const res = await directusFetch(url, { cache: 'no-store', next: { tags: ['documentosvehiculo'] }, logContext: 'fetchDocumentosByVehiculo' });
    if (!res.ok) throw new Error('Error al obtener documentos de vehiculo');
    const data: any = await res.json();
    const docs = Array.isArray(data.data) ? data.data : data.data ? [data.data] : [];
    return docs as T[];
  } catch (err) {
    console.error('Error al hacer fetch de documentos de vehiculo:', err);
    return [];
  }
}
export async function fetchDocReqProveedorCounts() {
  try {
    const res = await directusFetch(`${DIRECTUS_URL}/items/DocumentosRequeridos`, {
      cache: 'no-store',
      next: { tags: ['docreqproveedor'] },
      logContext: 'fetchDocReqProveedorCounts',
    });
    if (!res.ok) throw new Error('Error al obtener documentos requeridos');
    const data: DirectusListResponse<DirectusDocumentoRequerido> = await res.json();
    const counts: Record<string, number> = {};
    for (const doc of data.data) {
      const status = doc.status || 'sinEstado';
      counts[status] = (counts[status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  } catch (err) {
    console.error('Error al hacer fetch de documentos requeridos:', err);
    return [] as { status: string; count: number }[];
  }
}

export async function fetchParametroDocumento(id: string) {
  try {
    const res = await directusFetch(`${DIRECTUS_URL}/items/parametrosDocumentosRequeridosProveedor/${id}`, { cache: 'no-store', next: { tags: ['paramdocumento'] }, logContext: 'fetchParametroDocumento' });
    if (!res.ok) throw new Error('Error al obtener parametro documento');
    const data: { data: DirectusParametroDocumentoProveedor } = await res.json();
    return data.data;
  } catch (err) {
    console.error('Error al hacer fetch de parametro documento:', err);
    return null;
  }
}

export async function fetchTipoDocumento(id: string) {
  try {
    const res = await fetch(`${DIRECTUS_URL}/items/tiposDocumentos/${id}`, { cache: 'no-store', next: { tags: ['tipodocumento'] } });
    if (!res.ok) throw new Error('Error al obtener tipo documento');
    const data: { data: DirectusTipoDocumento } = await res.json();
    return data.data;
  } catch (err) {
    console.error('Error al hacer fetch de tipo documento:', err);
    return null;
  }
}

export async function fetchCustomersSICCPages<T extends DirectusCustomer = DirectusCustomer>(query = "") {
  const url = `${DIRECTUS_URL}/items/Clientes?limit=1&meta=filter_count${query ? `&filter[name][_contains]=${encodeURIComponent(query)}` : ''}`;
  try {
    const res = await directusFetch(url, {
      cache: 'no-cache',
      next: { tags: ['customersSICC'] },
      logContext: 'fetchCustomersSICCPages',
    });
    if (!res.ok) throw new Error('Error al obtener total de clientes');
    const data: DirectusListResponse<T> = await res.json();
    const count = data?.meta?.filter_count ?? 0;
    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (err) {
    console.error('Error al hacer fetch de paginas de clientes:', err);
    return 0;
  }
}
// Generic helpers for customers using Directus REST API
export async function getCustomers<T extends DirectusCustomer = DirectusCustomer>(
  query = '',
  currentPage = 1,
): Promise<T[]> {
  const url = `${DIRECTUS_URL}/items/Clientes?page=${currentPage}&limit=${ITEMS_PER_PAGE}&sort=name${query ? `&filter[name][_contains]=${encodeURIComponent(query)}` : ''}`;
  try {
    const res = await directusFetch(url, { cache: 'no-store', next: { tags: ['customers'] }, logContext: 'getCustomers' });
    if (!res.ok) throw new Error('Error al obtener clientes');
    const data: DirectusListResponse<T> = await res.json();
    return data.data;
  } catch (err) {
    console.error('Error al hacer fetch de clientes:', err);
    return [];
  }
}

export async function fetchCustomerById<T extends DirectusCustomer = DirectusCustomer>(id: string): Promise<T | null> {
  try {
    const res = await directusFetch(`${DIRECTUS_URL}/items/Clientes/${id}`, { cache: 'no-store', next: { tags: ['customers']}, logContext: 'fetchCustomerById' });
    if (!res.ok) throw new Error('Error al obtener cliente');
    const data: { data: T } = await res.json();
    return data.data;
  } catch (err) {
    console.error('Error al hacer fetch de cliente:', err);
    return null;
  }
}

export async function fetchCustomersPages<T extends DirectusCustomer = DirectusCustomer>(query = '') {
  const url = `${DIRECTUS_URL}/items/Clientes?limit=1&meta=filter_count${query ? `&filter[name][_contains]=${encodeURIComponent(query)}` : ''}`;
  try {
    const res = await directusFetch(url, { cache: 'no-store', next: { tags: ['customers'] }, logContext: 'fetchCustomersPages' });
    if (!res.ok) throw new Error('Error al obtener total de clientes');
    const data: DirectusListResponse<T> = await res.json();
    const count = data?.meta?.filter_count ?? 0;
    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (err) {
    console.error('Error al hacer fetch de paginas de clientes:', err);
    return 0;
  }
}


export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
export interface DocAPresentar {
  id: string;
  clienteId: string;
  cliente: string;
  siteId: string;
  site: string;
  requerimientoId: string;
  requerimiento: string;
  proveedorId: string;
  proveedor: string;
  tipo: 'proveedor' | 'persona' | 'vehiculo';
}

export async function fetchDocsAPresentar(): Promise<DocAPresentar[]> {
  const docs: DocAPresentar[] = [];

  async function fetchEndpoint(endpoint: string, tipo: 'proveedor' | 'persona' | 'vehiculo', fields: string) {
    if (docs.length >= 5) return;
    const params = new URLSearchParams();
    params.append('filter[status][_eq]', 'toPresent');
    params.append('sort', '-id');
    params.append('limit', String(5 - docs.length));
    params.append('fields', fields);
    const res = await directusFetch(`${DIRECTUS_URL}/items/${endpoint}?${params.toString()}`, { cache: 'no-store', next: { tags: ['docsapresentar'] }, logContext: `fetchDocsAPresentar:${endpoint}` });
    if (!res.ok) return;
    const data: DirectusListResponse<any> = await res.json();
    for (const item of data.data) {
      let prov: any = null;
      if (tipo === 'proveedor') prov = item.idProveedor;
      else if (tipo === 'persona') prov = item.idPersona?.idProveedor;
      else prov = item.idVehiculo?.idProveedor;
      if (!prov) continue;
      const req = prov.idRequerimientos;
      const site = req?.idSites;
      const cli = site?.idCliente;
      docs.push({
        id: String(item.id),
        clienteId: String(cli?.id ?? ''),
        cliente: cli?.name ?? '',
        siteId: String(site?.id ?? ''),
        site: site?.nombre ?? '',
        requerimientoId: String(req?.id ?? ''),
        requerimiento: req?.nombre ?? '',
        proveedorId: String(prov?.id ?? ''),
        proveedor: prov?.nombre ?? '',
        tipo,
      });
      if (docs.length >= 5) break;
    }
  }

  await fetchEndpoint(
    'DocumentosRequeridos',
    'proveedor',
    'id,idProveedor.id,idProveedor.nombre,idProveedor.idRequerimientos.id,idProveedor.idRequerimientos.nombre,idProveedor.idRequerimientos.idSites.id,idProveedor.idRequerimientos.idSites.nombre,idProveedor.idRequerimientos.idSites.idCliente.id,idProveedor.idRequerimientos.idSites.idCliente.name'
  );
  await fetchEndpoint(
    'documentosRequeridosPersonas',
    'persona',
    'id,idPersona.idProveedor.id,idPersona.idProveedor.nombre,idPersona.idProveedor.idRequerimientos.id,idPersona.idProveedor.idRequerimientos.nombre,idPersona.idProveedor.idRequerimientos.idSites.id,idPersona.idProveedor.idRequerimientos.idSites.nombre,idPersona.idProveedor.idRequerimientos.idSites.idCliente.id,idPersona.idProveedor.idRequerimientos.idSites.idCliente.name'
  );
  await fetchEndpoint(
    'documentosRequeridosVehiculos',
    'vehiculo',
    'id,idVehiculo.idProveedor.id,idVehiculo.idProveedor.nombre,idVehiculo.idProveedor.idRequerimientos.id,idVehiculo.idProveedor.idRequerimientos.nombre,idVehiculo.idProveedor.idRequerimientos.idSites.id,idVehiculo.idProveedor.idRequerimientos.idSites.nombre,idVehiculo.idProveedor.idRequerimientos.idSites.idCliente.id,idVehiculo.idProveedor.idRequerimientos.idSites.idCliente.name'
  );

  return docs.slice(0, 5);
}
