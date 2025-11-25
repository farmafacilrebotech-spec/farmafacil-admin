import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  const htmlContent = `
    <p>Hola <strong>${nombreFarmacia}</strong>,</p>
    <p>Tu farmacia ha sido dada de alta correctamente en <strong>FarmaFácil</strong>.</p>
    <p><strong>🔐 Datos de acceso al Panel:</strong><br>
    Usuario: ${emailLogin}<br>
    Contraseña: ${password}</p>

    <p>Adjuntamos tu <strong>PDF de Bienvenida</strong> con tu QR personalizado.</p>

    <p>Un saludo,<br>
    <strong>Pilar – FarmaFácil / ReBoTech Solutions</strong></p>
  `;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "FarmaFácil <noreply@farmafacil.com>",
    to: [emailFarmacia, emailPilar], // ENVIAR A AMBOS
    subject: `Bienvenida a FarmaFácil - ${nombreFarmacia}`,
    html: htmlContent,
    attachments: [
      {
        filename: `Bienvenida_${nombreFarmacia}.pdf`,
        content: Buffer.from(pdfBuffer),
      },
    ],
  });
}
