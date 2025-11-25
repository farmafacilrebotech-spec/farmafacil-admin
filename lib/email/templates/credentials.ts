// lib/email/templates/credentials.ts
// Plain string template for credentials email

interface CredentialsData {
  nombre_farmacia: string;
  email_acceso: string;
  password: string;
  farmacia_id: string;
}

export function templateCredentials({
  nombre_farmacia,
  email_acceso,
  password,
  farmacia_id,
}: CredentialsData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
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
          .credentials {
            background: white;
            border-left: 4px solid #1ABBB3;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .button {
            display: inline-block;
            background: #1ABBB3;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Tus Credenciales de Acceso</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${nombre_farmacia}</strong>,</p>
            <p>Estas son tus credenciales para acceder al panel de FarmaFácil:</p>
            
            <div class="credentials">
              <p><strong>ID de Farmacia:</strong> ${farmacia_id}</p>
              <p><strong>Usuario:</strong> ${email_acceso}</p>
              <p><strong>Contraseña:</strong> ${password}</p>
            </div>

            <p>Accede a tu panel aquí:</p>
            <a href="https://farmafacil-farmacias.netlify.app/login" class="button">Ir al Panel</a>

            <p style="margin-top: 30px;">Si no has solicitado este email, por favor ignóralo.</p>
            <p>Un saludo,<br><strong>Equipo FarmaFácil</strong></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

