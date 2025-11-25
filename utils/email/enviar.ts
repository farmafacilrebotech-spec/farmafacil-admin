import { Resend } from "resend";

export async function enviarEmail({
  to,
  subject,
  html,
  attachments = [],
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return await resend.emails.send({
    from: "FarmaFácil <noreply@farmafacil.app>",
    to,
    subject,
    html,
    attachments,
  });
}
