export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { telefono, nombre_farmacia, farmacia_id } = body;

    // Import dinámico de Resend para evitar ReactServerComponentsError
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY!);

    const mensaje = `
Hola! 👋

🎉 Bienvenid@ a FarmaFácil, ${nombre_farmacia}!

Tu farmacia ha sido registrada correctamente con el código:
👉 *${farmacia_id}*

En unos minutos recibirás un segundo mensaje con tus accesos al panel.

Gracias por confiar en ReboTech Solutions 💚
`;

    // Enviar email o WhatsApp según configuración
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.EMAIL_TO_TEST ?? "tu_email",
      subject: `Bienvenida a FarmaFácil (${nombre_farmacia})`,
      text: mensaje,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });

  } catch (error: any) {
    console.error("Error enviando bienvenida:", error);
    return new Response(JSON.stringify({ error: true }), { status: 500 });
  }
}
