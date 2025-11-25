// lib/email/templates/welcome.ts
// Plain string template for simple welcome email (no PDF)

interface WelcomeData {
  nombre_farmacia: string;
  farmacia_id: string;
}

export function templateWelcome({
  nombre_farmacia,
  farmacia_id,
}: WelcomeData): string {
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
          .button {
            display: inline-block;
            background: #1ABBB3;
            color: white;
            padding: 12px 18px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>¡Bienvenidos a FarmaFácil!</h2>
          </div>
          <div class="content">
            <p>Hola <strong>${nombre_farmacia}</strong>,</p>
            <p>Tu farmacia ya está registrada correctamente en la plataforma (ID: <strong>${farmacia_id}</strong>).</p>

            <p>🔔 Antes de continuar, te recomendamos reservar una breve sesión de bienvenida para revisar los accesos y activar tu catálogo.</p>

            <p style="text-align: center; margin: 30px 0;">
              <a href="https://calendly.com/farmafacil/bienvenida" class="button">
                Reservar cita ahora 📅
              </a>
            </p>

            <p>Gracias por confiar en FarmaFácil 💚</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

