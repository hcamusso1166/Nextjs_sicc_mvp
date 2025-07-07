"use client";
import { useState } from "react";
import { Button } from "@/app/ui/button";

import Link from "next/link";
import { createRequerimiento } from "@/app/lib/data";

export default function CreateRequerimientoForm({ siteId }: { siteId: string }) {
  const [nombre, setNombre] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRequerimiento({ nombre, siteId });
    setSuccess(true);
    setNombre("");
  };

  if (success) {
    return (
      <div className="space-y-4">
        <p className="text-lg font-semibold">Requerimiento creado correctamente.</p>
        <div className="flex gap-4">
          <Link href="/dashboard/customersSICC/sites" className="underline">Volver</Link>
          <Button onClick={() => setSuccess(false)}>Crear nuevo Requerimiento</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium">Nombre</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>
      <Button type="submit">Crear Requerimiento</Button>
    </form>
  );
}