// app/api/farmacias/enviar-contrato/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { enviarEmail } from "@/utils/email/enviar";
import { plantillaEnviarContrato } from "@/utils/email/contrato";

export async function POST(req: Request) {
  try {
    const { email, nombre_farmacia, pdfBase64 } = await req.json();

    const pdfBuffer = Buffer.from(pdfBase64, "base64");

    await enviarEmail({
      to: email,
      subject: "Contrato de servicio – FarmaFácil",
      html: plantillaEnviarContrato({ nombre_farmacia }),
      attachments: [
        { filename: "Contrato-FarmaFacil.pdf", content: pdfBuffer }
      ],
    });

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error enviando contrato" },
      { status: 500 }
    );
  }
}
