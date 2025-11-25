// lib/emailPDF.ts
import { Resend } from "resend";
import { enviarEmail } from "@/utils/email/enviar";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function enviarEmailBienvenidaPDF({
  emailFarmacia,
  emailPilar,
  nombreFarmacia,
  emailLogin,
  password,
  pdfBuffer,
}: {
  emailFarmacia: string;
  emailPilar: string;
  nombreFarmacia: string;
  emailLogin: string;
  password: string;
  pdfBuffer: Uint8Array;
}) {
  const html = `
    <p>Hola <strong>${nombreFarmacia}</strong>,</p>
    <p>Bienvenid@ a <strong>FarmaFácil</strong>.</p>

    <p><strong>🔐 Accesos al Panel:</strong><br>
    Usuario: ${emailLogin}<br>
    Contraseña: ${password}</p>

    <p>Adjuntamos tu PDF de bienvenida con tu QR personalizado.</p>

    <p>Un saludo,<br>
    <strong>Pilar – FarmaFácil / ReBoTech Solutions</strong></p>
  `;

  await resend.emails.send({
    from: "FarmaFácil <noreply@farmafacil.app>",
    to: [emailFarmacia, emailPilar],
    subject: `Bienvenida a FarmaFácil – ${nombreFarmacia}`,
    html,
    attachments: [
      {
        filename: `Bienvenida_${nombreFarmacia}.pdf`,
        content: Buffer.from(pdfBuffer),
      },
    ],
  });
}
