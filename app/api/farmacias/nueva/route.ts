import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { generarYSubirQR, generarQRBase64 } from "@/lib/qr";
import { enviarWhatsappAltaFarmacia } from "@/lib/whatsapp";
import { generarPDFBienvenida } from "@/lib/pdf";
import { enviarEmailBienvenidaPDF } from "@/lib/emailPDF";

/* --------------------------------------------- */
/*       GENERAR ID TIPO FF00001-25              */
/* --------------------------------------------- */
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

/* --------------------------------------------- */
/*                    POST                       */
/* --------------------------------------------- */

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

    /* --------------------------------------------- */
    /*              1. GENERAR ID FARMACIA            */
    /* --------------------------------------------- */
    const farmaciaId = await generarIdFarmacia();

    /* --------------------------------------------- */
    /*              2. SUBIR LOGO SI EXISTE           */
    /* --------------------------------------------- */
    let logoUrl: string | null = null;

    if (logoBase64) {
      const fileName = `${farmaciaId}.png`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("farmacias-logos")
        .upload(fileName, Buffer.from(logoBase64, "base64"), {
          contentType: "image/png",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/farmacias-logos/${fileName}`;
    }

    /* --------------------------------------------- */
    /*             3. GENERAR QR + BASE64            */
    /* --------------------------------------------- */
    const qrUrl = await generarYSubirQR(farmaciaId);
    const qrBase64 = await generarQRBase64(farmaciaId);

    /* --------------------------------------------- */
    /*          4. INSERTAR FARMACIA EN BBDD         */
    /* --------------------------------------------- */
    const { error: insertError } = await supabaseAdmin.from("farmacias").insert({
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

    if (insertError) throw insertError;

    /* --------------------------------------------- */
    /*           5. CREAR CREDENCIALES               */
    /* --------------------------------------------- */
    const emailLogin = email;
    const password = farmaciaId.toLowerCase();

    const { error: credError } = await supabaseAdmin
      .from("farmacias_credenciales")
      .insert({
        farmacia_id: farmaciaId,
        email_login: emailLogin,
        password_hash: password,
      });

    if (credError) throw credError;

    /* --------------------------------------------- */
    /*          6. GENERAR PDF DE BIENVENIDA         */
    /* --------------------------------------------- */
    const pdfBuffer = await generarPDFBienvenida({
      nombreFarmacia: nombre,
      qrBase64,
      logoFarmaciaBase64: logoBase64 ? `data:image/png;base64,${logoBase64}` : undefined,
    });

    /* --------------------------------------------- */
    /*       7. ENVIAR EMAIL CON PDF ADJUNTO         */
    /*       (farmacia + Pilar simultáneamente)      */
    /* --------------------------------------------- */
    await enviarEmailBienvenidaPDF({
      emailFarmacia: email,
      emailPilar: "farmafacil.rebotech@gmail.com",
      nombreFarmacia: nombre,
      emailLogin,
      password,
      pdfBuffer,
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

    /* --------------------------------------------- */
    /*                     OK                        */
    /* --------------------------------------------- */
    return NextResponse.json({ ok: true, farmaciaId });

  } catch (err: any) {
    console.error("Error creando farmacia:", err);
    return NextResponse.json(
      { error: err.message ?? "Error interno" },
      { status: 500 }
    );
  }
}
