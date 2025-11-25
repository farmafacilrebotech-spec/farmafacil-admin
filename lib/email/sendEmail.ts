// lib/email/sendEmail.ts
// This is the ONLY file in the entire project that imports Resend
// Uses dynamic import to avoid build-time React Server Components error

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

/**
 * Send an email using Resend API
 * Uses dynamic import to avoid ReactServerComponentsError at build time
 */
export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: SendEmailOptions) {
  // Dynamic import to prevent build-time bundling issues
  const { Resend } = await import("resend");
  
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const result = await resend.emails.send({
      from: "FarmaFácil <noreply@farmafacil.app>",
      to,
      subject,
      html,
      attachments: attachments?.map((att) => ({
        filename: att.filename,
        content: att.content,
      })),
    });

    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
