export const runtime = "edge";

import { NextResponse } from "next/server";
import { enviarEmail } from "@/utils/email/enviar";
import { plantillaReenvioCredenciales } from "@/utils/email/credenciales";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const html = plantillaReenvioCredenciales(body);

    await enviarEmail({
      to: body.email_acceso,
      subject: "Tus credenciales de FarmaFácil",
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error enviando email" }, { status: 500 });
  }
}
