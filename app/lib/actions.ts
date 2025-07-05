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
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
  console.error('Failed to create customer in Directus', await response.text());
  throw new Error('Failed to create customer in Directus');
}
if (response.ok) {
  console.log('Create OK customer in Directus', await response.text());
  throw new Error('Failed to create customer in Directus');
}
  revalidateTag('customersSICC');
  revalidatePath('/dashboard/customersSICC', 'page');
  redirect('/dashboard/customersSICC');
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

  await fetch(`${DIRECTUS_URL}/items/Clientes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  revalidateTag('customersSICC');
  revalidatePath('/dashboard/customersSICC', 'page');
  redirect('/dashboard/customersSICC');
}

export async function deleteCustomerSICC(id: string) {
  await fetch(`${DIRECTUS_URL}/items/Clientes/${id}`, { method: 'DELETE' });
  revalidateTag('customersSICC');
  revalidatePath('/dashboard/customersSICC', 'page');
  redirect('/dashboard/customersSICC');
}