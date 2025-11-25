import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import CopyButton from "./copy-button";

export default async function FarmaciaDetallePage({ params }: { params: { id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: farmacia } = await supabase
    .from("farmacias")
    .select("*")
    .eq("farmacia_id", params.id)
    .single();

  const urlPublica = farmacia
    ? `${process.env.NEXT_PUBLIC_CLIENTE_URL}/farmacia/${farmacia.farmacia_id}`
    : null;

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

        {/* INFO DE LA FARMACIA */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row gap-6">
          {/* Columna izquierda */}
          <div className="flex flex-col items-center md:items-start gap-4 md:w-1/3">
            {/* LOGO */}
            <div className="w-28 h-28 relative rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
              <Image
                src={farmacia.logo_url}
                alt={farmacia.nombre_farmacia}
                fill
                className="object-contain"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold">{farmacia.nombre_farmacia}</h1>
              <p className="text-xs text-slate-500 mt-1">
                ID: {farmacia.farmacia_id}
              </p>
            </div>
          </div>

          {/* INFO DERECHA */}
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

        {/* QR + ENLACE */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-1/2 flex flex-col items-center gap-3">
            <h2 className="text-sm font-semibold text-slate-700">QR de la farmacia</h2>

            <div className="w-48 h-48 relative bg-slate-100 rounded-lg overflow-hidden">
              <Image
                src={farmacia.qr_url}
                alt="QR farmacia"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="md:w-1/2 space-y-3 text-center md:text-left">
            <h3 className="font-semibold text-sm text-slate-700">Enlace público</h3>

            <p className="text-xs break-all">{urlPublica}</p>

            <CopyButton text={urlPublica!} />
          </div>
        </div>

      </div>
    </div>
  );
}
