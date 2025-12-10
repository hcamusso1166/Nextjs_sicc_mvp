'use server';

import { z } from 'zod';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { directusFetch, slugify } from './utils';

type RevalidateTarget =
  | { type: 'tag'; value: string }
  | { type: 'path'; value: string; pathType?: 'layout' | 'page' };

async function revalidateResources(targets: RevalidateTarget[]) {
  let failed = false;
  for (const target of targets) {
    try {
      if (target.type === 'tag') {
        await revalidateTag(target.value);
      } else {
        await revalidatePath(target.value, target.pathType);
      }
    } catch (error) {
      failed = true;
      console.error(
        JSON.stringify({
          event: 'revalidate_failed',
          targetType: target.type,
          targetValue: target.value,
          pathType: target.type === 'path' ? target.pathType : undefined,
          error: error instanceof Error ? error.message : String(error),
        }),
      );
    }
  }
  return failed;
}

function withRevalidateError(url: string, failed: boolean) {
  if (!failed) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}revalidateError=1`;
}
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
   await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

import {
  DIRECTUS_URL,
  fetchProveedoresByRequerimiento,
  fetchDocumentosByProveedor,
} from './data';
import {
  DirectusParametroDocumentoProveedor, DirectusTipoDocumento, } from './definitions';

export async function createCustomerSICC(formData: FormData) {
  const name = String(formData.get('name') || '');
  const body = {
    status: formData.get('status'),
    name,
    CUIT: formData.get('CUIT'),
    contacto: formData.get('contacto'),
    mail: formData.get('mail'),
    tel: formData.get('tel'),
    mailNotif: formData.get('mailNotif'),
    urlSlug: slugify(name),
  };

  const response = await directusFetch(`${DIRECTUS_URL}/items/Clientes`, {
    next: { revalidate: 0 },
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    logContext: 'createCustomerSICC',
  });

  const data = await response.json().catch(() => ({}));
  const id = data?.data?.id as string | undefined;
  console.log('Create OK customer in Directus', id);

  const revalidateFailed = await revalidateResources([
    { type: 'tag', value: 'customersSICC' },
    { type: 'tag', value: 'customers' },
    { type: 'path', value: '/dashboard/customersSICC' },
    { type: 'path', value: '/', pathType: 'layout' },
  ]);
  redirect(withRevalidateError('/dashboard/customersSICC', revalidateFailed));
}

export async function updateCustomerSICC(id: string, formData: FormData) {
  const name = String(formData.get('name') || '');
  const body = {
    status: formData.get('status'),
    name,
    CUIT: formData.get('CUIT'),
    contacto: formData.get('contacto'),
    mail: formData.get('mail'),
    tel: formData.get('tel'),
    mailNotif: formData.get('mailNotif'),
    urlSlug: slugify(name),
  };

  await directusFetch(`${DIRECTUS_URL}/items/Clientes/${id}`, {
    next: { revalidate: 0 },
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    logContext: 'updateCustomerSICC',
  });
  const revalidateFailed = await revalidateResources([
    { type: 'tag', value: 'customersSICC' },
    { type: 'tag', value: 'customers' },
    { type: 'path', value: '/dashboard/customersSICC' },
  ]);
  return redirect(
    withRevalidateError('/dashboard/customersSICC', revalidateFailed),
  );
}

export async function deleteCustomerSICC(id: string) {
  await directusFetch(`${DIRECTUS_URL}/items/Clientes/${id}`, {
    next: { revalidate: 0 },
    method: 'DELETE',
    logContext: 'deleteCustomerSICC',
  });
  const revalidateFailed = await revalidateResources([
    { type: 'tag', value: 'customersSICC' },
    { type: 'tag', value: 'customers' },
    { type: 'path', value: '/dashboard/customersSICC' },
  ]);
  return redirect(
    withRevalidateError('/dashboard/customersSICC', revalidateFailed),
  );
}
export async function createSite(formData: FormData) {
  const nombre = String(formData.get('nombre') || '');
  const customerId = String(formData.get('idCliente') || '');
  const body = {
    status: formData.get('status'),
    idCliente: customerId,
    nombre,
    urlSlug: slugify(nombre),
  };

const response = await directusFetch(`${DIRECTUS_URL}/items/sites`, {
    next: { revalidate: 0 },
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    logContext: 'createSite',
  });
  const data = await response.json().catch(() => ({}));
  const id = data?.data?.id as string | undefined;
  const revalidateFailed = await revalidateResources([
    { type: 'tag', value: 'sites' },
    { type: 'path', value: '/dashboard/customersSICC/sites' },
  ]);
    if (id) {
    return redirect(`/dashboard/customersSICC/sites/success?id=${id}&customerId=${customerId}`);
  }
  return redirect(
    withRevalidateError('/dashboard/customersSICC', revalidateFailed),
  );
}

export async function createSiteManager(formData: FormData) {
  const nombre = String(formData.get('nombre') || '');
  const customerId = String(formData.get('idCliente') || '');
  const body = {
    status: formData.get('status'),
    idCliente: customerId,
    nombre,
    urlSlug: slugify(nombre),
  };

  const response = await directusFetch(`${DIRECTUS_URL}/items/sites`, {
    next: { revalidate: 0 },
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    logContext: 'createSiteManager',
  });
  const data = await response.json().catch(() => ({}));
  const id = data?.data?.id as string | undefined;
  const revalidateFailed = await revalidateResources([
    { type: 'tag', value: 'sites' },
    { type: 'path', value: '/dashboard/manager' },
  ]);
  if (id) {
    return redirect(
      `/dashboard/manager/sites/success?id=${id}&customerId=${customerId}`,
    );
  }
  return redirect(
    withRevalidateError(
      `/dashboard/manager?customerId=${customerId}`,
      revalidateFailed,
    ),
  );
}

export async function createRequerimiento(formData: FormData) {
  const nombre = String(formData.get('nombre') || '');
  const siteId = String(formData.get('idSites') || '');
  const body = {
    status: formData.get('status'),
    idSites: siteId,
    nombre,
    urlSlug: slugify(nombre),
  };
  const response = await directusFetch(`${DIRECTUS_URL}/items/requerimiento`, {
    next: { revalidate: 0 },
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    logContext: 'createRequerimiento',
  });
  const data = await response.json().catch(() => ({}));
  const id = data?.data?.id as string | undefined;
  console.log('Create OK requerimiento in Directus', id);
  const revalidateFailed = await revalidateResources([
    { type: 'tag', value: 'requerimientos' },
    { type: 'path', value: '/dashboard/customersSICC/sites/requerimientos' },
  ]);
    if (id) {
    return redirect(
      withRevalidateError(
        `/dashboard/customersSICC/sites/requerimientos/success?id=${id}&siteId=${siteId}`,
        revalidateFailed,
      ),
    );
  }
  return redirect(withRevalidateError('/dashboard/customersSICC', revalidateFailed));
}
export async function createRequerimientoManager(formData: FormData) {
  const nombre = String(formData.get('nombre') || '');
  const siteId = String(formData.get('idSites') || '');
  const customerId = String(formData.get('customerId') || '');
  const body = {
    status: formData.get('status'),
    idSites: siteId,
    nombre,
    urlSlug: slugify(nombre),
  };
  const response = await directusFetch(`${DIRECTUS_URL}/items/requerimiento`, {
    next: { revalidate: 0 },
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    logContext: 'createRequerimientoManager',
  });
  const data = await response.json().catch(() => ({}));
  const id = data?.data?.id as string | undefined;
  const revalidateFailed = await revalidateResources([
    { type: 'tag', value: 'requerimientos' },
    { type: 'path', value: '/dashboard/manager' },
  ]);
  if (id) {
    return redirect(
      withRevalidateError(
        `/dashboard/manager/sites/requerimientos/success?id=${id}&siteId=${siteId}&customerId=${customerId}`,
        revalidateFailed,
      ),
    );
  }
  return redirect(
    withRevalidateError(
      `/dashboard/manager?customerId=${customerId}`,
      revalidateFailed,
    ),
  );
}
export async function createProveedor(formData: FormData) {
  const nombre = String(formData.get('nombre') || '');
  const reqId = String(formData.get('idRequerimientos') || '');
  const body = {
    status: formData.get('status'),
    idRequerimientos: reqId,
    nombre,
    CUIT: formData.get('CUIT'),
    urlSlug: slugify(nombre),
  };
  const response = await directusFetch(`${DIRECTUS_URL}/items/proveedor`, {
    next: { revalidate: 0 },
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    logContext: 'createProveedor',
  });
  const data = await response.json().catch(() => ({}));
  const id = data?.data?.id as string | undefined;
  const revalidateFailed = await revalidateResources([
    { type: 'tag', value: 'proveedores' },
    { type: 'path', value: '/dashboard/manager' },
  ]);
  const customerId = String(formData.get('customerId') || '');
  const siteId = String(formData.get('siteId') || '');
  if (id) {
    return redirect(
      withRevalidateError(
        `/dashboard/manager/sites/requerimientos/proveedores/success?id=${id}&reqId=${reqId}&siteId=${siteId}&customerId=${customerId}`,
        revalidateFailed,
      ),
    );
  }
  return redirect(
    withRevalidateError(
      `/dashboard/manager?customerId=${customerId}`,
      revalidateFailed,
    ),
  );
}

export async function createProveedorManager(formData: FormData) {
  return createProveedor(formData);
}
export async function generarDocumentosRequeridos(
  reqId: string,
): Promise<string[]> {
  const proveedores = await fetchProveedoresByRequerimiento(reqId);
  const fechaHoy = new Date().toISOString().split('T')[0];
  const urlParams = `${DIRECTUS_URL}/items/parametrosDocumentosRequeridosProveedor?filter%5BidTipoEntidad%5D%5B_in%5D=1,2&filter%5BfechaDesde%5D%5B_lte%5D=${fechaHoy}&filter%5BfechaHasta%5D%5B_gte%5D=${fechaHoy}`;
  const resParam = await directusFetch(urlParams, {
    cache: 'no-store',
    logContext: 'generarDocumentosRequeridos:parametros',
  });
  const dataParam: { data: DirectusParametroDocumentoProveedor[] } =
    await resParam.json().catch(() => ({ data: [] }));
  const parametros = dataParam.data || [];
  const resultados: string[] = [];
  for (const prov of proveedores) {
    const docs = await fetchDocumentosByProveedor(prov.id);
    if (docs.length === 0) {
      for (const param of parametros) {
        let validezDias: number | undefined;
        if (param.idTipoDocumento) {
          const tipoRes = await directusFetch(
            `${DIRECTUS_URL}/items/tiposDocumentos/${param.idTipoDocumento}`,
            { cache: 'no-store', logContext: 'generarDocumentosRequeridos:tipo' },
          );
          const tipoData: { data: DirectusTipoDocumento & { validezDocumentoDias?: number } } =
            await tipoRes.json().catch(() => ({ data: {} as any }));
          validezDias = tipoData.data?.validezDocumentoDias;
        }
        const body = {
          status: 'toPresent',
          validezDias,
          idProveedor: prov.id,
          idParametro: param.id,
        };
        await directusFetch(`${DIRECTUS_URL}/items/DocumentosRequeridos`, {
          next: { revalidate: 0 },
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          logContext: 'generarDocumentosRequeridos:create',
        });
      }
      resultados.push(prov.nombre || prov.id);
    }
  }
  await revalidateResources([{ type: 'tag', value: 'documentos' }]);
  return resultados;
}
// Generic actions for customers
export async function createCustomer(formData: FormData) {
  const name = String(formData.get('name') || '');
  const body = {
    status: formData.get('status'),
    name,
    CUIT: formData.get('CUIT'),
    contacto: formData.get('contacto'),
    mail: formData.get('mail'),
    tel: formData.get('tel'),
    mailNotif: formData.get('mailNotif'),
    urlSlug: slugify(name),
  };

  await directusFetch(`${DIRECTUS_URL}/items/Clientes`, {next: { revalidate: 0 },
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    logContext: 'createCustomer',
  });

  const revalidateFailed = await revalidateResources([
    { type: 'tag', value: 'customers' },
    { type: 'path', value: '/dashboard/customers' },
  ]);
  return redirect(withRevalidateError('/dashboard/customers', revalidateFailed));
}

export async function updateCustomer(id: string, formData: FormData) {
  const name = String(formData.get('name') || '');
  const body = {
    status: formData.get('status'),
    name,
    CUIT: formData.get('CUIT'),
    contacto: formData.get('contacto'),
    mail: formData.get('mail'),
    tel: formData.get('tel'),
    mailNotif: formData.get('mailNotif'),
    urlSlug: slugify(name),
  };

  await directusFetch(`${DIRECTUS_URL}/items/Clientes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    logContext: 'updateCustomer',
  });
  const revalidateFailed = await revalidateResources([
    { type: 'tag', value: 'customers' },
    { type: 'path', value: '/dashboard/customers' },
  ]);
  return redirect(withRevalidateError('/dashboard/customers', revalidateFailed));
}

export async function deleteCustomer(id: string) {
  await directusFetch(`${DIRECTUS_URL}/items/Clientes/${id}`, {
    method: 'DELETE',
    logContext: 'deleteCustomer',
  });
  const revalidateFailed = await revalidateResources([
    { type: 'tag', value: 'customers' },
    { type: 'path', value: '/dashboard/customers' },
  ]);
  return redirect(withRevalidateError('/dashboard/customers', revalidateFailed));
}
