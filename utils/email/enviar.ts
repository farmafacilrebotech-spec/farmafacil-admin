// utils/email/enviar.ts
"use server";
export const runtime = "nodejs";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function enviarEmail({
  to,
  subject,
  html,
  attachments = [],
}: {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
}) {
  return await resend.emails.send({
    from: "FarmaFácil <noreply@farmafacil.app>",
    to,
    subject,
    html,
    attachments,
  });
}
