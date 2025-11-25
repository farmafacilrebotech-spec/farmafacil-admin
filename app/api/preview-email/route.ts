import { NextResponse } from "next/server";
import { enviarEmailBienvenida } from "@/lib/email";

export async function GET() {
  const html = await crearHtmlPrueba();

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

async function crearHtmlPrueba() {
  return `
    ${`
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

      <!-- LOGO FARMAFÁCIL -->
      <img 
        src="https://zvxxdmfljbtlenjatqgm.supabase.co/storage/v1/object/public/farmacias-logos/Farmafacil.png"
        alt="Logo FarmaFácil"
        style="max-width: 160px; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;"
      />

      <h1>¡Bienvenido a FarmaFácil!</h1>
    </div>

    <div class="content">
      <h2>Hola, Farmacia de prueba</h2>
      <p>Tu farmacia ha sido registrada exitosamente en nuestra plataforma. A continuación encontrarás toda la información necesaria para comenzar:</p>

      <div class="credentials-box">
        <h3>🔐 Tus Credenciales de Acceso</h3>
        <p><strong>Código de Farmacia:</strong> FF00001-25</p>
        <p><strong>Usuario:</strong> farmacia@test.com</p>
        <p><strong>Contraseña:</strong> 123456</p>
      </div>

      <p>Puedes acceder a tu panel de farmacia haciendo clic en el siguiente botón:</p>
      <center>
        <a href="https://farmafacil-farmacias.netlify.app/login" class="button">Acceder al Panel</a>
      </center>

      <div class="qr-container">
        <h3>📱 Tu Código QR</h3>
        <p>Este código QR permite a tus clientes acceder directamente a tu perfil:</p>
        <img src="https://qr.io/1234567890" alt="Código QR de la farmacia" />
      </div>

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
</html>`}
  `;
}
