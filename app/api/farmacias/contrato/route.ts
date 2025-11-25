import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { generarContratoPDF } from "@/lib/pdfContrato";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      farmaciaId,
      razon_social,
      cif_nif,
      direccion_fiscal,
      email_facturacion,
      telefono_facturacion,
      titular_cuenta,
      iban,
      dia_cobro_preferente,
      metodo_pago_inicial,
      plan,
      cuota_mensual_custom,
      cuota_alta,
    } = body;

    if (!farmaciaId) {
      return NextResponse.json(
        { error: "Falta farmaciaId" },
        { status: 400 }
      );
    }

    // 1) Determinar cuota mensual según plan
    let cuota_mensual: number;

    switch (plan) {
      case "Fidelización":
        cuota_mensual = 39;
        break;
      case "Starter":
        cuota_mensual = 59;
        break;
      case "Pro":
        cuota_mensual = 65;
        break;
      case "Enterprise":
        cuota_mensual = 75;
        break;
      case "Otros":
      default:
        cuota_mensual = Number(cuota_mensual_custom || 0);
        break;
    }

    const cuotaAltaNumber = Number(cuota_alta || 0);
    const diaCobroNumber = dia_cobro_preferente
      ? Number(dia_cobro_preferente)
      : 1;

    // Método de pago recurrente siempre domiciliación bancaria
    const metodo_pago_recurrente = "domiciliacion";

    // 2) Generar contrato PDF con todos los datos
    const contratoBuffer = await generarContratoPDF({
      farmaciaId,
      razon_social,
      cif_nif,
      direccion_fiscal,
      email_facturacion,
      telefono_facturacion,
      titular_cuenta,
      iban,
      dia_cobro_preferente: diaCobroNumber,
      metodo_pago_inicial,
      plan,
      cuota_mensual: cuota_mensual,
      cuota_alta: cuotaAltaNumber,
      metodo_pago_recurrente,
      fecha_inicio: new Date().toISOString(),
    });

    // 3) Subir PDF a Supabase Storage
    const fileName = `CONTRATO_${farmaciaId}.pdf`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("farmacias-contratos")
      .upload(fileName, contratoBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const contratoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/farmacias-contratos/${fileName}`;

    // 4) Upsert en farmacias_facturacion
    const { error: upsertError } = await supabaseAdmin
      .from("farmacias_facturacion")
      .upsert({
        farmacia_id: farmaciaId,
        razon_social,
        cif_nif,
        direccion_fiscal,
        email_facturacion,
        telefono_facturacion,
        metodo_pago: metodo_pago_recurrente,
        metodo_pago_inicial,
        iban,
        titular_cuenta,
        dia_cobro_preferente: diaCobroNumber,
        plan,
        cuota_mensual,
        cuota_alta: cuotaAltaNumber,
        // contrato todavía no firmado, solo generado
        contrato_firmado: false,
        fecha_firma: null,
        contrato_url: contratoUrl,
      });

    if (upsertError) throw upsertError;

    return NextResponse.json({ ok: true, contratoUrl });
  } catch (err: any) {
    console.error("Error en contrato:", err);
    return NextResponse.json(
      { error: err.message ?? "Error interno en contrato" },
      { status: 500 }
    );
  }
}
