'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import { slugify } from '@/app/lib/utils';

const ITEMS_PER_PAGE = 10;
const DIRECTUS_BASE =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || 'https://tto.com.ar';

type DirectusListResponse<T> = {
  data: T[];
  meta?: { filter_count?: number };
};

type Customer = {
  id: string;
  status: string;
  name: string;
  CUIT?: string;
  contacto?: string;
  mail?: string;
  tel?: string;
  mailNotif?: string;
};

const emptyForm: Omit<Customer, 'id'> = {
  status: 'published',
  name: '',
  CUIT: '',
  contacto: '',
  mail: '',
  tel: '',
  mailNotif: '',
};

function CustomerForm({
  values,
  onChange,
  onSubmit,
  onCancel,
  loading,
  mode,
}: {
  values: Omit<Customer, 'id'>;
  onChange: (values: Omit<Customer, 'id'>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  loading: boolean;
  mode: 'create' | 'edit';
}) {
  const handleInput = (field: keyof Omit<Customer, 'id'>) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange({ ...values, [field]: event.target.value });

  return (
    <form
      className="mt-4 rounded-md bg-gray-50 p-4 md:p-6 grid grid-cols-1 gap-4 md:grid-cols-2 text-xs"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={values.name}
          onChange={handleInput('name')}
          className="block w-full rounded-md border border-gray-200 p-2"
        />
      </div>
      <div>
        <label htmlFor="CUIT" className="mb-2 block text-sm font-medium">
          CUIT
        </label>
        <input
          id="CUIT"
          name="CUIT"
          type="text"
          value={values.CUIT}
          onChange={handleInput('CUIT')}
          className="block w-full rounded-md border border-gray-200 p-2"
        />
      </div>
      <div>
        <label htmlFor="contacto" className="mb-2 block text-sm font-medium">
          Contacto
        </label>
        <input
          id="contacto"
          name="contacto"
          type="text"
          value={values.contacto}
          onChange={handleInput('contacto')}
          className="block w-full rounded-md border border-gray-200 p-2"
        />
      </div>
      <div>
        <label htmlFor="mail" className="mb-2 block text-sm font-medium">
          Mail
        </label>
        <input
          id="mail"
          name="mail"
          type="email"
          value={values.mail}
          onChange={handleInput('mail')}
          className="block w-full rounded-md border border-gray-200 p-2"
        />
      </div>
      <div>
        <label htmlFor="tel" className="mb-2 block text-sm font-medium">
          Tel
        </label>
        <input
          id="tel"
          name="tel"
          type="text"
          value={values.tel}
          onChange={handleInput('tel')}
          className="block w-full rounded-md border border-gray-200"
        />
      </div>
      <div>
        <label htmlFor="mailNotif" className="mb-2 block text-sm font-medium">
          Mail Notif
        </label>
        <input
          id="mailNotif"
          name="mailNotif"
          type="email"
          value={values.mailNotif}
          onChange={handleInput('mailNotif')}
          className="block w-full rounded-md border border-gray-200 p-2"
        />
      </div>
      <div>
        <label htmlFor="status" className="mb-2 block text-sm font-medium">
          Estado
        </label>
        <select
          id="status"
          name="status"
          value={values.status}
          onChange={handleInput('status')}
          className="block w-full rounded-md border border-gray-200 p-2"
        >
          <option value="published">Publicado</option>
          <option value="draft">Borrador</option>
          <option value="archived">Archivado</option>
        </select>
      </div>
      <div className="col-span-full flex justify-end gap-3">
        <button
          type="button"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
          disabled={loading}
        >
          {mode === 'create' ? 'Crear Cliente' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
}

export default function CustomersSICCReactPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Omit<Customer, 'id'>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const listUrl = useMemo(() => {
    const searchFilter = query ? `&filter[name][_contains]=${encodeURIComponent(query)}` : '';
    return `${DIRECTUS_BASE}/items/Clientes?page=${currentPage}&limit=${ITEMS_PER_PAGE}&sort=name&meta=filter_count${searchFilter}`;
  }, [currentPage, query]);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(listUrl, { cache: 'no-store' });
      if (!response.ok) throw new Error('No se pudieron obtener los clientes');
      const payload: DirectusListResponse<Customer> = await response.json();
      setCustomers(payload.data ?? []);
      const count = payload.meta?.filter_count ?? 0;
      setTotalPages(Math.max(1, Math.ceil(count / ITEMS_PER_PAGE)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [listUrl]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleResetForm = () => {
    setFormValues(emptyForm);
    setEditingId(null);
  };

  const saveCustomer = async () => {
    setSaving(true);
    setError(null);
    try {
      const url = editingId
        ? `${DIRECTUS_BASE}/items/Clientes/${editingId}`
        : `${DIRECTUS_BASE}/items/Clientes`;
      const method = editingId ? 'PATCH' : 'POST';
      const body = { ...formValues, urlSlug: slugify(formValues.name) };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('No se pudo guardar el cliente');
      handleResetForm();
      await fetchCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`${DIRECTUS_BASE}/items/Clientes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('No se pudo eliminar el cliente');
      await fetchCustomers();
      if (editingId === id) handleResetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setFormValues({
      status: customer.status,
      name: customer.name,
      CUIT: customer.CUIT ?? '',
      contacto: customer.contacto ?? '',
      mail: customer.mail ?? '',
      tel: customer.tel ?? '',
      mailNotif: customer.mailNotif ?? '',
    });
  };

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Clientes</h1>
      </div>
      <div className="mt-4 flex flex-col gap-4 md:mt-8">
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Buscar clientes..."
            value={query}
            onChange={(event) => {
              setCurrentPage(1);
              setQuery(event.target.value);
            }}
            className="w-full rounded-lg border border-gray-200 p-2"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-gray-900">
              <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-3 py-4 font-medium">
                    Estado
                  </th>
                  <th scope="col" className="px-3 py-4 font-medium">
                    Nombre
                  </th>
                  <th scope="col" className="px-3 py-4 font-medium">
                    CUIT
                  </th>
                  <th scope="col" className="px-3 py-4 font-medium">
                    Contacto
                  </th>
                  <th scope="col" className="px-3 py-4 font-medium">
                    Mail
                  </th>
                  <th scope="col" className="px-3 py-4 font-medium">
                    Tel
                  </th>
                  <th scope="col" className="px-3 py-4 font-medium">
                    Mail Notif
                  </th>
                  <th scope="col" className="px-3 py-4 font-medium text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-gray-900">
                {customers.map((customer) => (
                  <tr key={customer.id} className="group">
                    <td className="whitespace-nowrap px-3 py-4 text-sm">{customer.status}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">{customer.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">{customer.CUIT}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">{customer.contacto}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">{customer.mail}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">{customer.tel}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">{customer.mailNotif}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          className="rounded-md border p-2 hover:bg-gray-100"
                          onClick={() => startEdit(customer)}
                          disabled={saving}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="rounded-md border p-2 hover:bg-gray-100 text-red-700"
                          onClick={() => deleteCustomer(customer.id)}
                          disabled={saving}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && !loading && (
                  <tr>
                    <td className="px-3 py-4 text-sm" colSpan={8}>
                      No hay clientes que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td className="px-3 py-4 text-sm" colSpan={8}>
                      Cargando clientes...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-5 flex w-full items-center justify-between gap-3">
          <div className="text-sm text-gray-600">Página {currentPage} de {totalPages}</div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1 || loading}
            >
              Anterior
            </button>
            <button
              className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Siguiente
            </button>
          </div>
        </div>
        <div className="mt-6 rounded-md border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-2">
            {editingId ? 'Editar cliente' : 'Crear cliente'}
          </h2>
          <CustomerForm
            values={formValues}
            onChange={setFormValues}
            onSubmit={saveCustomer}
            onCancel={handleResetForm}
            loading={saving}
            mode={editingId ? 'edit' : 'create'}
          />
        </div>
      </div>
    </div>
  );
}