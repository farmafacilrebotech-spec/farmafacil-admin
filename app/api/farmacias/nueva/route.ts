// app/api/farmacias/nueva/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { generarYSubirQR, generarQRBase64 } from "@/lib/qr";
import { enviarWhatsappAltaFarmacia } from "@/lib/whatsapp";
import { generarPDFBienvenida } from "@/lib/pdf";
import { sendEmail } from "@/app/api/_emails/send";
import { plantillaBienvenida } from "@/utils/email/bienvenida";

async function generarIdFarmacia() {
  const year = new Date().getFullYear().toString().slice(-2);

  const { data, error } = await supabaseAdmin
    .from("codigo_autonumerico")
    .select("*")
    .single();

  if (error || !data)
    throw error || new Error("No hay registro en codigo_autonumerico");

  const nextNumber = data.ultimo_numero + 1;

  const { error: updateError } = await supabaseAdmin
    .from("codigo_autonumerico")
    .update({ ultimo_numero: nextNumber })
    .eq("id", data.id);

  if (updateError) throw updateError;

  return `FF${String(nextNumber).padStart(5, "0")}-${year}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nombre,
      contacto,
      telefono,
      email,
      provincia,
      direccion,
      instagram,
      horario,
      color,
      mensaje,
      observaciones,
      logoBase64,
    } = body;

    const farmaciaId = await generarIdFarmacia();

    let logoUrl: string | null = null;

    if (logoBase64) {
      const fileName = `${farmaciaId}.png`;

      await supabaseAdmin.storage
        .from("farmacias-logos")
        .upload(fileName, Buffer.from(logoBase64, "base64"), {
          contentType: "image/png",
          upsert: true,
        });

      logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/farmacias-logos/${fileName}`;
    }

    const qrUrl = await generarYSubirQR(farmaciaId);
    const qrBase64 = await generarQRBase64(farmaciaId);

    await supabaseAdmin.from("farmacias").insert({
      farmacia_id: farmaciaId,
      nombre_farmacia: nombre,
      persona_contacto: contacto,
      telefono,
      email,
      provincia_id: provincia,
      direccion,
      instagram,
      horario,
      color,
      mensaje_bienvenida: mensaje,
      observaciones,
      logo_url: logoUrl,
      qr_url: qrUrl,
    });

    const emailLogin = email;
    const password = farmaciaId.toLowerCase();

    await supabaseAdmin.from("farmacias_credenciales").insert({
      farmacia_id: farmaciaId,
      email_login: emailLogin,
      password_hash: password,
    });

    const pdfBuffer = await generarPDFBienvenida({
      nombreFarmacia: nombre,
      qrBase64,
      logoFarmaciaBase64: logoBase64 ? `data:image/png;base64,${logoBase64}` : undefined,
    });
    
    await sendEmail({
      to: email,
      subject: `Bienvenida a FarmaFácil - ${nombre}`,
      html: plantillaBienvenida({ nombre_farmacia: nombre, emailLogin, password }),
      attachments: [
        {
          filename: `Bienvenida-${nombre}-${farmaciaId}.pdf`,
          content: Buffer.from(pdfBuffer),
        },
      ],
    });

    /* --------------------------------------------- */
    /*      8. ENVIAR WHATSAPP DE BIENVENIDA         */
    /* --------------------------------------------- */
    await enviarWhatsappAltaFarmacia({
      telefono,
      nombreFarmacia: nombre,
      email: emailLogin,
      password,
      farmaciaId,
    });

    return NextResponse.json({ ok: true, farmaciaId });

  } catch (err: any) {
    console.error("Error creando farmacia:", err);
    return NextResponse.json(
      { error: err.message ?? "Error interno" },
      { status: 500 }
    );
  }
}
