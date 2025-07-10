import { Button } from "@/app/ui/button";
import Link from "next/link";
import { createRequerimiento } from "@/app/lib/actions";

type Props = {
  siteId: string;
  customerId?: string;
  cancelHref?: string;
  action?: (formData: FormData) => Promise<void>;
};

export default function CreateRequerimientoForm({
  siteId,
  customerId = '',
  cancelHref = '/dashboard/customersSICC',
  action = createRequerimiento,
}: Props) {
  return (
    <form action={action}>
      <input type="hidden" name="idSites" value={siteId} />
      {customerId && <input type="hidden" name="customerId" value={customerId} />}
      <div className="rounded-md bg-gray-50 p-4 md:p-6 grid grid-cols-1 gap-4 md:grid-cols-2 text-xs">
        <div>
          <label htmlFor="nombre" className="mb-1 block font-medium">Nombre</label>
          <input id="nombre" name="nombre" type="text" className="block w-full rounded-md border border-gray-200 p-2" />
        </div>
        <div>
          <label htmlFor="status" className="mb-1 block font-medium">Estado</label>
          <select id="status" name="status" className="block w-full rounded-md border border-gray-200 p-2">
            <option value="published">Publicado</option>
            <option value="draft">Borrador</option>
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={cancelHref}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Crear Requerimiento</Button>
      </div>
    </form>
  );
}