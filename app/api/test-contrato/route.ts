import { generarContratoPDF } from "@/lib/pdfContrato";

export async function GET() {
  const pdfBytes = await generarContratoPDF({
    farmaciaId: "FF00123-25",
    razon_social: "Farmacia San José S.L.",
    cif_nif: "B12345678",
    direccion_fiscal: "Calle Mayor 12, Valencia",
    email_facturacion: "facturacion@farmacia.com",
    telefono_facturacion: "600000000",
    metodo_pago_inicial: "Tarjeta",
    metodo_pago_recurrente: "domiciliacion",
    plan: "Starter",
    cuota_mensual: 59,
    cuota_alta: 89,
    fecha_inicio: "2025-01-15",
    iban: "ES1201823456123456789012",
    titular_cuenta: "Farmacia San José S.L.",
    dia_cobro_preferente: 10,
  });

  // ⚡ Convertimos Uint8Array → Buffer (TS deja de quejarse)
  const buffer = Buffer.from(pdfBytes);

  return new Response(buffer as any, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=contrato-test.pdf",
      "Content-Length": buffer.length.toString(),
    },
  });
}
