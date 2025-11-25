// app/api/farmacias/enviar-pdf-bienvenida/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { templateWelcomePDF } from "@/lib/email/templates/welcomePDF";

export async function POST(req: Request) {
  try {
    const {
      emailFarmacia,
      emailPilar,
      nombreFarmacia,
      emailLogin,
      password,
      pdfBase64,
    } = await req.json();

    const pdfBuffer = Buffer.from(pdfBase64, "base64");

    const html = templateWelcomePDF({
      nombreFarmacia,
      emailLogin,
      password,
    });

    // Dynamic import to avoid build-time bundling
    const { sendEmail } = await import("@/lib/email/sendEmail");

    await sendEmail({
      to: [emailFarmacia, emailPilar],
      subject: `Bienvenida a FarmaFácil – ${nombreFarmacia}`,
      html,
      attachments: [
        {
          filename: `Bienvenida-${nombreFarmacia}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error enviando PDF bienvenida:", err);
    return NextResponse.json(
      { error: "Error enviando PDF bienvenida" },
      { status: 500 }
    );
  }
}
