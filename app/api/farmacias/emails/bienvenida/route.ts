// Import dinámico de Resend para evitar ReactServerComponentsError
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { nombre_farmacia, email, telefono, farmacia_id } = await req.json();    
    const html = `
      <div style="font-family: Arial; font-size: 15px;">
        <h2>🎉¡Bienvenido/a a FarmaFácil!, <strong>${nombre_farmacia}</strong></h2>

        <p>Tu farmacia ha sido registrada correctamente.</p>
        <p>ID de farmacia: <strong>${farmacia_id}</strong></p>
        <p>Teléfono: ${telefono}</p>
        <p>Ya puedes agendar tu cita para completar tus datos.</p>
        <p>Gracias por confiar en FarmaFácil 💚</p>
      </div>
    `;
    
    await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: email,
        subject: `¡Bienvenido/a a FarmaFácil, ${nombre_farmacia}!`,
        html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error enviando email:", error);
    return NextResponse.json({ error: "Error enviando email" }, { status: 500 });
  }
}