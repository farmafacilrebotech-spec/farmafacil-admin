// app/api/farmacias/enviar-contrato/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { templateSendContract } from "@/lib/email/templates/sendContract";

export async function POST(req: Request) {
  try {
    const { email, nombre_farmacia, pdfBase64 } = await req.json();

    const pdfBuffer = Buffer.from(pdfBase64, "base64");

    // Dynamic import to avoid build-time bundling
    const { sendEmail } = await import("@/lib/email/sendEmail");

    await sendEmail({
      to: email,
      subject: "Contrato de Servicio – FarmaFácil",
      html: templateSendContract({ nombre_farmacia }),
      attachments: [
        {
          filename: "Contrato-FarmaFacil.pdf",
          content: pdfBuffer,
        },
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error enviando contrato" }, { status: 500 });
  }
}
