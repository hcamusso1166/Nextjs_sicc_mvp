// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};
export interface DirectusCustomer {
  id: string;
  status: string;
  name: string;
  urlSlug: string;
  CUIT: string;
  calle: string;
  nro: number;
  piso: number;
  dpto: string;
  contacto: string;
  mail: string;
  tel: string;
    mailNotif: string;
}

export type CustomerSICC = DirectusCustomer;

export interface DirectusSite {
  id: string;
  status: string;
  idCliente: string;
  nombre: string;
  urlSlug: string;
}
export interface DirectusRequerimiento {
  id: string;
  status: string;
  idSites: string;
  nombre: string;
  fechaInicio?: string;
  fechaProyectadaFin?: string | null;
  fechaRealFin?: string | null;
}

export interface DirectusProveedor {
  id: string;
  status: string;
  idRequerimientos: string | null;
  nombre: string;
  CUIT?: string;
  urlSlug?: string;
}

export interface DirectusPersona {
  id: string;
  status: string;
  idProveedor: string | null;
  nombre: string;
  apellido?: string;
  DNI?: number;
}

export interface DirectusVehiculo {
  id: string;
  status: string;
  idProveedor: string | null;
  dominio: string;
  marca?: string;
  modelo?: string;
  color?: string;
  observaciones?: string | null;
}

export interface DirectusDocumentoRequerido {
  id: string;
  status: string;
  idProveedor: string | null;
  idParametro: string;
  fechaPresentacion?: string;
  validezDias?: number;
  proximaFechaPresentacion?: string | null;
}

export interface DirectusParametroDocumentoProveedor {
  id: string;
  idTipoDocumento: string;
}

export interface DirectusTipoDocumento {
  id: string;
  nombreDocumento: string;
}

export interface DirectusListResponse<T> {
  data: T[];
  meta?: {
    filter_count?: number;
    [key: string]: unknown;
  };
}

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
