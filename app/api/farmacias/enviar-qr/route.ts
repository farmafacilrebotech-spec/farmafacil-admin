// app/api/farmacias/enviar-qr/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { enviarEmail } from "@/utils/email/enviar";
import { plantillaEnviarQR } from "@/utils/email/qr";

export async function POST(req: Request) {
  try {
    const { email, nombre_farmacia, farmacia_id, pdfBase64 } = await req.json();

    const pdfBuffer = Buffer.from(pdfBase64, "base64");

    await enviarEmail({
      to: email,
      subject: "QR de tu farmacia – FarmaFácil",
      html: plantillaEnviarQR({ nombre_farmacia, farmacia_id }),
      attachments: [
        {
          filename: `QR-${farmacia_id}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("ERROR ENVIANDO QR:", err);
    return NextResponse.json(
      { error: "Error enviando email" },
      { status: 500 }
    );
  }
}
