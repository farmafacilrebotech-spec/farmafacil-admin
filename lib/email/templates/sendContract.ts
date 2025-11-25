// lib/email/templates/sendContract.ts
// Plain string template for contract email

interface SendContractData {
  nombre_farmacia: string;
}

export function templateSendContract({
  nombre_farmacia,
}: SendContractData): string {
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
            <h2>📄 Tu Contrato de Servicio</h2>
          </div>
          <div class="content">
            <p>Hola <strong>${nombre_farmacia}</strong>,</p>
            <p>Adjuntamos el contrato de servicio de FarmaFácil.</p>
            <p>Por favor, revísalo y si tienes alguna duda, no dudes en contactarnos.</p>
            <p>Un saludo,<br><strong>Equipo FarmaFácil</strong></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

