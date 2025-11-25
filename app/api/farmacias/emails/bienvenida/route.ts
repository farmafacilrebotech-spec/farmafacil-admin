import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, nombre_farmacia, farmacia_id } = await req.json();

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: `¡Bienvenido/a a FarmaFácil!`,
      html: `
        <h2>Hola ${nombre_farmacia}</h2>
        <p>Tu farmacia ya está registrada en FarmaFácil.</p>
        <p>Código interno: <strong>${farmacia_id}</strong></p>
        <p>Pronto recibirás tus credenciales de acceso.</p>
        <br />
        <p>Gracias por confiar en nosotros.</p>
      `,
    });

    if (error) throw error;

    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
