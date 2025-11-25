import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailBienvenidaData {
  emailDestino: string;
  nombreFarmacia: string;
  farmaciaId: string;
  usuario: string;
  password: string;
  qrBase64?: string;
}

/**
 * Envía email de bienvenida con credenciales y QR
 */
export async function enviarEmailBienvenida(data: EmailBienvenidaData): Promise<void> {
  const {
    emailDestino,
    nombreFarmacia,
    farmaciaId,
    usuario,
    password,
    qrBase64
  } = data;

  const panelUrl = process.env.NEXT_PUBLIC_FARMACIA_PANEL_URL || 'https://farmafacil-farmacias.netlify.app';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #1ABBB3 0%, #4ED3C2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .credentials-box {
          background: white;
          border-left: 4px solid #1ABBB3;
          padding: 20px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .credentials-box strong {
          color: #1ABBB3;
        }
        .button {
          display: inline-block;
          background: #1ABBB3;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .qr-container {
          text-align: center;
          margin: 30px 0;
        }
        .qr-container img {
          max-width: 250px;
          border: 2px solid #1ABBB3;
          border-radius: 10px;
          padding: 10px;
          background: white;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>¡Bienvenido a FarmaFácil!</h1>
      </div>
      <div class="content">
        <h2>Hola, ${nombreFarmacia}</h2>
        <p>Tu farmacia ha sido registrada exitosamente en nuestra plataforma. A continuación encontrarás toda la información necesaria para comenzar:</p>
        
        <div class="credentials-box">
          <h3>🔐 Tus Credenciales de Acceso</h3>
          <p><strong>Código de Farmacia:</strong> ${farmaciaId}</p>
          <p><strong>Usuario:</strong> ${usuario}</p>
          <p><strong>Contraseña:</strong> ${password}</p>
        </div>

        <p>Puedes acceder a tu panel de farmacia haciendo clic en el siguiente botón:</p>
        <center>
          <a href="${panelUrl}/login" class="button">Acceder al Panel</a>
        </center>

        ${qrBase64 ? `
        <div class="qr-container">
          <h3>📱 Tu Código QR</h3>
          <p>Este código QR permite a tus clientes acceder directamente a tu perfil:</p>
          <img src="${qrBase64}" alt="Código QR de la farmacia" />
        </div>
        ` : ''}

        <p><strong>Próximos pasos:</strong></p>
        <ol>
          <li>Accede al panel con tus credenciales</li>
          <li>Completa tu perfil y configura tus servicios</li>
          <li>Descarga tu código QR desde el panel</li>
          <li>Comparte el código QR con tus clientes</li>
        </ol>

        <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>

        <div class="footer">
          <p>Este es un email automático de FarmaFácil<br>
          © ${new Date().getFullYear()} FarmaFácil - Todos los derechos reservados</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Intentar con Resend primero
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'FarmaFácil <noreply@farmafacil.com>',
        to: emailDestino,
        subject: `¡Bienvenido a FarmaFácil! - ${nombreFarmacia}`,
        html: htmlContent,
      });
      console.log('Email enviado con Resend');
    } else {
      // Fallback a nodemailer (requiere configuración SMTP)
      console.warn('RESEND_API_KEY no configurada, usando nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@farmafacil.com',
        to: emailDestino,
        subject: `¡Bienvenido a FarmaFácil! - ${nombreFarmacia}`,
        html: htmlContent,
      });
      console.log('Email enviado con Nodemailer');
    }
  } catch (error) {
    console.error('Error enviando email:', error);
    throw error;
  }
}

/**
 * Reenvía las credenciales a una farmacia
 */
export async function reenviarCredenciales(data: EmailBienvenidaData): Promise<void> {
  return enviarEmailBienvenida(data);
}

