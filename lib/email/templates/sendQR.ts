// lib/email/templates/sendQR.ts
// Plain string template for QR email

interface SendQRData {
  nombre_farmacia: string;
  farmacia_id: string;
}

export function templateSendQR({
  nombre_farmacia,
  farmacia_id,
}: SendQRData): string {
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
            background: #1ABBB3;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📱 Tu Código QR - FarmaFácil</h2>
          </div>
          <div class="content">
            <p>Hola <strong>${nombre_farmacia}</strong>,</p>
            <p>Adjuntamos el código QR de tu farmacia (ID: <strong>${farmacia_id}</strong>).</p>
            <p>Puedes imprimirlo y colocarlo en tu establecimiento para que tus clientes accedan fácilmente a tu catálogo digital.</p>
            <p>Gracias por confiar en FarmaFácil 💚</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

