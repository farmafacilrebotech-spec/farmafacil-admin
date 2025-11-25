// app/panel/farmacias/[id]/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

import CopyButton from "./copy-button";

export default function FarmaciaDetallePage({ params }: { params: { id: string } }) {
  const [farmacia, setFarmacia] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde API interna (evita usar Supabase directo en cliente)
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/farmacias/get?id=${params.id}`);
        const data = await res.json();
        setFarmacia(data);
      } catch (e) {
        console.error("Error cargando farmacia:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) return <p className="p-10">Cargando...</p>;
  if (!farmacia) return <p className="p-10 text-red-500">Farmacia no encontrada</p>;

  const urlPublica = `${process.env.NEXT_PUBLIC_CLIENTE_URL}/farmacia/${farmacia.farmacia_id}`;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="flex items-center justify-between mb-4">
          <Link
            href="/panel/farmacias"
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al listado
          </Link>
        </div>

        {/* TARJETA PRINCIPAL */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row gap-6">

          <div className="flex flex-col items-center md:items-start gap-4 md:w-1/3">
            <div className="w-28 h-28 relative rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
              {farmacia.logo_url ? (
                <Image src={farmacia.logo_url} alt="logo" fill className="object-contain" />
              ) : (
                <span className="text-xs text-slate-400">Sin logo</span>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{farmacia.nombre_farmacia}</h1>
              <p className="text-xs text-slate-500 mt-1">ID: {farmacia.farmacia_id}</p>
            </div>
          </div>

          <div className="md:w-2/3 space-y-4">
            <div>
              <h2 className="font-semibold text-sm text-slate-700">Contacto</h2>
              <p>{farmacia.persona_contacto}</p>
              <p>Tel: {farmacia.telefono}</p>
              <p>Email: {farmacia.email}</p>
            </div>

            {farmacia.direccion && (
              <div>
                <h2 className="font-semibold text-sm text-slate-700">Dirección</h2>
                <p>{farmacia.direccion}</p>
              </div>
            )}

            {farmacia.horario && (
              <div>
                <h2 className="font-semibold text-sm text-slate-700">Horario</h2>
                <p className="whitespace-pre-line">{farmacia.horario}</p>
              </div>
            )}
          </div>
        </div>

        {/* QR + LINK */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-1/2 flex flex-col items-center gap-3">
            <h2 className="text-sm font-semibold text-slate-700">QR de la farmacia</h2>
            <div className="w-48 h-48 relative bg-slate-100 rounded-lg overflow-hidden">
              {farmacia.qr_url ? (
                <Image src={farmacia.qr_url} alt="QR" fill className="object-contain" />
              ) : (
                <span className="text-xs text-slate-500">No generado</span>
              )}
            </div>
          </div>

          <div className="md:w-1/2 space-y-3 text-center md:text-left">
            <h3 className="font-semibold text-sm text-slate-700">Enlace público</h3>

            <p className="text-xs break-all">{urlPublica}</p>

            <CopyButton text={urlPublica} />
          </div>
        </div>

        {/* ACCIONES RÁPIDAS */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Acciones rápidas</h2>

          {/* Reenviar credenciales */}
          <button
            className="bg-[#1ABBB3] hover:bg-[#159e96] text-white px-4 py-2 rounded-md w-full"
            onClick={async () => {
              await fetch("/api/farmacias/reenviar-credenciales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email_acceso: farmacia.email,
                  nombre_farmacia: farmacia.nombre_farmacia,
                  farmacia_id: farmacia.farmacia_id,
                }),
              });
              alert("Credenciales enviadas");
            }}
          >
            🔐 Reenviar credenciales
          </button>

          {/* Enviar QR */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full"
            onClick={() => alert("Función PDF QR pendiente de implementar")}
          >
            📲 Enviar QR por email
          </button>

          {/* Enviar contrato */}
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-md w-full"
            onClick={() => alert("Función enviar contrato pendiente de implementar")}
          >
            📄 Enviar contrato firmado
          </button>
        </div>

      </div>
    </div>
  );
}
