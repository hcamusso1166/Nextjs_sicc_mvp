'use server';

import { z } from 'zod';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { slugify } from './utils';
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

  const response = await fetch(`${DIRECTUS_URL}/items/Clientes`, {
    next: { revalidate: 0 },
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  const data = await response.json().catch(() => ({}));
  const id = data?.data?.id as string | undefined;
  console.log('Create OK customer in Directus', id);

  revalidateTag('customersSICC');
  revalidatePath('/dashboard/customersSICC');
    if (id) {
    return redirect(`/dashboard/customersSICC/success?id=${id}`);
  }
  return redirect('/dashboard/customersSICC');
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

  await fetch(`${DIRECTUS_URL}/items/Clientes/${id}`, { next: { revalidate: 0 }  ,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  revalidateTag('customersSICC');
  revalidatePath('/dashboard/manager');
  return redirect('/dashboard/customersSICC');
}

export async function deleteCustomerSICC(id: string) {
  await fetch(`${DIRECTUS_URL}/items/Clientes/${id}`, { next: { revalidate: 0 }  , method: 'DELETE' });
  revalidateTag('customersSICC');
  revalidatePath('/dashboard/customersSICC' );
  return redirect('/dashboard/customersSICC');
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

const response = await fetch(`${DIRECTUS_URL}/items/sites`, {
    next: { revalidate: 0 },
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  const id = data?.data?.id as string | undefined;
  revalidateTag('sites');
  revalidatePath('/dashboard/customersSICC/sites');
    if (id) {
    return redirect(`/dashboard/customersSICC/sites/success?id=${id}&customerId=${customerId}`);
  }
  return redirect('/dashboard/customersSICC');
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

  const response = await fetch(`${DIRECTUS_URL}/items/sites`, {
    next: { revalidate: 0 },
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  const id = data?.data?.id as string | undefined;
  revalidateTag('sites');
  revalidatePath('/dashboard/manager');
  if (id) {
    return redirect(
      `/dashboard/manager/sites/success?id=${id}&customerId=${customerId}`,
    );
  }
  return redirect(`/dashboard/manager?customerId=${customerId}`);
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
  const response = await fetch(`${DIRECTUS_URL}/items/requerimiento`, {
    next: { revalidate: 0 },
    method: "POST",
      headers: { 'Content-Type': 'application/json' } ,    
      body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  const id = data?.data?.id as string | undefined;
  console.log('Create OK requerimiento in Directus', id);
  revalidateTag('requerimientos');
  revalidatePath('/dashboard/customersSICC/sites/requerimientos');
    if (id) {
    return redirect(`/dashboard/customersSICC/sites/requerimientos/success?id=${id}&siteId=${siteId}`);
  }
  return redirect('/dashboard/customersSICC');
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
  const response = await fetch(`${DIRECTUS_URL}/items/requerimiento`, {
    next: { revalidate: 0 },
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  const id = data?.data?.id as string | undefined;
  revalidateTag('requerimientos');
  revalidatePath('/dashboard/manager');
  if (id) {
    return redirect(
      `/dashboard/manager/sites/requerimientos/success?id=${id}&siteId=${siteId}&customerId=${customerId}`,
    );
  }
  return redirect(`/dashboard/manager?customerId=${customerId}`);
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
  const response = await fetch(`${DIRECTUS_URL}/items/proveedor`, {
    next: { revalidate: 0 },
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  const id = data?.data?.id as string | undefined;
  revalidateTag('proveedores');
  revalidatePath('/dashboard/manager');
  const customerId = String(formData.get('customerId') || '');
  const siteId = String(formData.get('siteId') || '');
  if (id) {
    return redirect(
      `/dashboard/manager/sites/requerimientos/proveedores/success?id=${id}&reqId=${reqId}&siteId=${siteId}&customerId=${customerId}`,
    );
  }
  return redirect(`/dashboard/manager?customerId=${customerId}`);
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
  const resParam = await fetch(urlParams, { cache: 'no-store' });
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
          const tipoRes = await fetch(
            `${DIRECTUS_URL}/items/tiposDocumentos/${param.idTipoDocumento}`,
            { cache: 'no-store' },
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
        await fetch(`${DIRECTUS_URL}/items/DocumentosRequeridos`, {
          next: { revalidate: 0 },
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
      resultados.push(prov.nombre || prov.id);
    }
  }
  revalidateTag('documentos');
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

  await fetch(`${DIRECTUS_URL}/items/Clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  revalidateTag('customers');
  revalidatePath('/dashboard/customers');
  return redirect('/dashboard/customers');
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

  await fetch(`${DIRECTUS_URL}/items/Clientes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  revalidateTag('customers');
  revalidatePath('/dashboard/customers');
  return redirect('/dashboard/customers');
}

export async function deleteCustomer(id: string) {
  await fetch(`${DIRECTUS_URL}/items/Clientes/${id}`, { method: 'DELETE' });
  revalidateTag('customers');
  revalidatePath('/dashboard/customers');
  return redirect('/dashboard/customers');
}