// lib/email/templates/welcomePDF.ts
// Plain string template for welcome email with PDF attachment

interface WelcomePDFData {
  nombreFarmacia: string;
  emailLogin: string;
  password: string;
}

export function templateWelcomePDF({
  nombreFarmacia,
  emailLogin,
  password,
}: WelcomePDFData): string {
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
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido a FarmaFácil!</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${nombreFarmacia}</strong>,</p>
            <p>Te damos la bienvenida a FarmaFácil. Adjuntamos tu PDF de bienvenida con tu QR personalizado.</p>
            
            <div class="credentials">
              <h3>🔐 Tus Credenciales de Acceso</h3>
              <p><strong>Usuario:</strong> ${emailLogin}</p>
              <p><strong>Contraseña:</strong> ${password}</p>
            </div>

            <p>Puedes acceder a tu panel en:</p>
            <p><a href="https://farmafacil-farmacias.netlify.app/login" style="color: #1ABBB3;">Panel de Farmacia</a></p>

            <p>Un saludo,<br><strong>Equipo FarmaFácil / ReBoTech Solutions</strong></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

