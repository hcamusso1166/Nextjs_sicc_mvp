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

import { DIRECTUS_URL } from './data';

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

  await revalidateTag('customersSICC');
  await revalidatePath('/dashboard/customersSICC');
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
  revalidatePath('/dashboard/customersSICC');
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
export async function createRequerimiento(formData: FormData) {
  const nombre = String(formData.get('nombre') || '');
  const siteId = String(formData.get('idSites') || '');
  const body = {
    status: formData.get('status'),
    idSites: siteId,
    nombre,
    urlSlug: slugify(nombre),
  };
  const res = await fetch(`${DIRECTUS_URL}/items/requerimiento`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
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