// app/api/farmacias/reenviar-credenciales/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { templateCredentials } from "@/lib/email/templates/credentials";

export async function POST(req: Request) {
  try {
    const { farmaciaId } = await req.json();

    // Fetch farmacia data
    const { data: farmacia, error: farmaciaError } = await supabaseAdmin
      .from("farmacias")
      .select("nombre_farmacia, email")
      .eq("farmacia_id", farmaciaId)
      .single();

    if (farmaciaError || !farmacia) {
      throw new Error("Farmacia no encontrada");
    }

    // Fetch credentials
    const { data: credenciales, error: credencialesError } = await supabaseAdmin
      .from("farmacias_credenciales")
      .select("email_login, password_hash")
      .eq("farmacia_id", farmaciaId)
      .single();

    if (credencialesError || !credenciales) {
      throw new Error("Credenciales no encontradas");
    }

    const html = templateCredentials({
      nombre_farmacia: farmacia.nombre_farmacia,
      email_acceso: credenciales.email_login,
      password: credenciales.password_hash,
      farmacia_id: farmaciaId,
    });

    // Dynamic import to avoid build-time bundling
    const { sendEmail } = await import("@/lib/email/sendEmail");

    await sendEmail({
      to: credenciales.email_login,
      subject: "Tus credenciales de FarmaFácil",
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Error enviando email" }, { status: 500 });
  }
}
