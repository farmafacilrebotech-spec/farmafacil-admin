// app/api/_emails/send.ts
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

// --- Tipos ---
export interface EmailAttachment {
  filename: string;
  content: Buffer;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}

// --- Función principal ---
export async function sendEmail({ to, subject, html, attachments }: SendEmailOptions) {
  return await resend.emails.send({
    from: "FarmaFácil <noreply@farmafacil.app>",
    to,
    subject,
    html,
    attachments,
  });
}
