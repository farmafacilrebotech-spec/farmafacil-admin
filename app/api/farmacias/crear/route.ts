import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import QRCode from "qrcode";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
console.log("SERVICE ROLE KEY:", SUPABASE_SERVICE_ROLE_KEY);

// URL base para el QR
const FARMACIA_BASE_URL = process.env.NEXT_PUBLIC_CLIENTE_URL!;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const nombre_farmacia = formData.get("nombre_farmacia") as string | null;
    const persona_contacto = formData.get("persona_contacto") as string | null;
    const telefono = formData.get("telefono") as string | null;
    const email = formData.get("email") as string | null;
    const direccion = (formData.get("direccion") as string | null) ?? "";
    const instagram = (formData.get("instagram") as string | null) ?? null;
    const horario = (formData.get("horario") as string | null) ?? null;
    const color = (formData.get("color") as string | null) ?? null;
    const observaciones = (formData.get("observaciones") as string | null) ?? null;
    const mensaje_bienvenida =
      (formData.get("mensaje_bienvenida") as string | null) ?? null;

    const logoFile = formData.get("logo") as File | null;

    if (
      !nombre_farmacia ||
      !persona_contacto ||
      !telefono ||
      !email ||
      !logoFile
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1) SUBIR LOGO A STORAGE
    const logoExt = logoFile.name?.split(".").pop() || "png";
    const logoPath = `logos/${Date.now()}-${nombre_farmacia
      .toLowerCase()
      .replace(/\s+/g, "-")}.${logoExt}`;

    const logoArrayBuffer = await logoFile.arrayBuffer();
    const logoBuffer = Buffer.from(logoArrayBuffer);

    const { error: uploadLogoError } = await supabase.storage
      .from("farmacias-logos")
      .upload(logoPath, logoBuffer, {
        contentType: logoFile.type || "image/png",
        upsert: true,
      });

    if (uploadLogoError) {
      console.error(uploadLogoError);
      return NextResponse.json(
        { error: "Error subiendo el logo" },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl: logo_url },
    } = supabase.storage.from("farmacias-logos").getPublicUrl(logoPath);

    // 2) INSERTAR FARMACIA (sin qr aún)
    const { data: farmacia, error: insertError } = await supabase
        .from("farmacias")
        .insert({
          nombre_farmacia,
          persona_contacto,
          direccion,
          provincia_id: null,
          telefono,
          email,
          instagram,
          logo_url,
          horario,
          color,
          observaciones,
          mensaje_bienvenida,
  
          // provincia_id: null, // de momento sin relación
        })
        .select()
        .single();
        console.log("INSERT ERROR:", insertError);
        console.log("INSERT DATA:", farmacia);
  
      if (insertError || !farmacia) {
        console.error(insertError);
        return NextResponse.json(
          { error: "Error creando la farmacia" },
          { status: 500 }
        );
    }

    // 3) GENERAR URL PÚBLICA Y QR (ahora que tenemos farmacia_id)
    const farmaciaUrl = `${FARMACIA_BASE_URL}/farmacia/${farmacia.farmacia_id}`;

    const qrPngBuffer = await QRCode.toBuffer(farmaciaUrl, {
      width: 512,
      margin: 2,
    });

    const qrPath = `qr/${farmacia.farmacia_id}.png`;

    const { error: uploadQrError } = await supabase.storage
      .from("farmacias-qr")
      .upload(qrPath, qrPngBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadQrError) {
      console.error(uploadQrError);
      // no cortamos el alta, pero lo avisamos
    }

    const {
      data: { publicUrl: qr_url },
    } = supabase.storage.from("farmacias-qr").getPublicUrl(qrPath);

    // 4) ACTUALIZAR FARMACIA CON QR_URL
    await supabase
      .from("farmacias")
      .update({ qr_url })
      .eq("farmacia_id", farmacia.farmacia_id);
  

    // 4) ACTUALIZAR REGISTRO CON qr_url
    if (qr_url) {
      await supabase
        .from("farmacias")
        .update({ qr_url })
        .eq("id", farmacia.id);
    }

    return NextResponse.json(
      {
        ok: true,
        farmacia: {
          ...farmacia,
          logo_url,
          qr_url,
          url_publica: farmaciaUrl,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error procesando la solicitud" },
      { status: 500 }
    );
  }
}
