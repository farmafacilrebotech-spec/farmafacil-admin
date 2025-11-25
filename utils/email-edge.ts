import { Resend } from "resend";

export async function enviarEmail(destinatario: string, asunto: string, html: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return await resend.emails.send({
    from: "FarmaFácil <noreply@farmafacil.app>",
    to: destinatario,
    subject: asunto,
    html,
  });
}
