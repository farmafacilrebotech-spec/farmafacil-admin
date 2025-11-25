import { NextResponse } from "next/server";
export const runtime = "edge";

import { enviarEmail } from "@/utils/email/enviar";

export async function POST(req: Request) {
  try {
    const { email, nombre_farmacia, farmacia_id } = await req.json();

    const html = `
      <div style="font-family: Arial; font-size: 15px;">
        <h2>¡Bienvenidos a FarmaFácil!</h2>
        <p>Hola <b>${nombre_farmacia}</b>,</p>
        <p>Tu farmacia ya está registrada correctamente en la plataforma.</p>

        <p>🔔 Antes de continuar, te recomendamos reservar una breve sesión de bienvenida
        para revisar los accesos y activar tu catálogo.</p>

        <p>
          <a href="https://calendly.com/farmafacil/bienvenida"
            style="display:inline-block; background:#1abbb3; color:#ffffff; padding:12px 18px; border-radius:6px; text-decoration:none; font-weight:bold;">
            Reservar cita ahora 📅
          </a>
        </p>

        <p>Gracias por confiar en FarmaFácil 💚</p>
      </div>
    `;

    await enviarEmail({
      to: email,
      subject: "Bienvenido a FarmaFácil",
      html,
    });

    return Response.json({ ok: true });

  } catch (error) {
    console.error("ERROR EN EMAIL:", error);
    return NextResponse.json({ error: "Error enviando email" }, { status: 500 });
  }
}
