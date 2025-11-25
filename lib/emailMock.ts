interface RegistroData {
  nombre_farmacia: string;
  cif: string;
  responsable: string;
  telefono: string;
  email: string;
  direccion: string;
  horario: string;
  web?: string;
  color_primario: string;
  color_secundario?: string;
  modalidad_catalogo: string;
  mostrar_precios: string;
  mostrar_stock: string;
  necesita_kiosko: string;
  direccion_kiosko?: string;
  responsable_kiosko?: string;
  necesita_instalacion?: string;
  cupon_bienvenida: string;
  texto_bienvenida?: string;
  tipo_promociones?: string;
  tono_asistente: string;
  limites_asistente: string;
  mensaje_inicial_asistente: string;
  observaciones?: string;
  logo_url?: string;
  fecha_registro: string;
}

export function generatePharmacyEmail(data: RegistroData): string {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #47c7c0 0%, #34a89e 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { background: #47c7c0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido a FarmaFácil!</h1>
          </div>
          <div class="content">
            <p>Estimado/a <strong>${data.responsable}</strong>,</p>

            <p>Hemos recibido correctamente el registro de <strong>${data.nombre_farmacia}</strong> en nuestra plataforma FarmaFácil.</p>

            <p><strong>Resumen de tu registro:</strong></p>
            <ul>
              <li><strong>Farmacia:</strong> ${data.nombre_farmacia}</li>
              <li><strong>CIF:</strong> ${data.cif}</li>
              <li><strong>Email:</strong> ${data.email}</li>
              <li><strong>Teléfono:</strong> ${data.telefono}</li>
              <li><strong>Dirección:</strong> ${data.direccion}</li>
              <li><strong>Modalidad de catálogo:</strong> ${data.modalidad_catalogo}</li>
              <li><strong>Kiosko físico:</strong> ${data.necesita_kiosko === 'si' ? 'Sí' : 'No'}</li>
            </ul>

            <p>Nuestro equipo revisará tu información y se pondrá en contacto contigo en un plazo de <strong>24-48 horas</strong> para activar tu farmacia en la plataforma.</p>

            <p>Si tienes alguna duda o necesitas asistencia, no dudes en contactarnos:</p>
            <p>
              📧 soporte@farmafacil.com<br>
              📞 900 123 456
            </p>

            <p>¡Gracias por unirte a FarmaFácil!</p>
          </div>
          <div class="footer">
            <p>© 2024 FarmaFácil - Todos los derechos reservados</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function generateRebotechEmail(data: RegistroData): string {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background: #1e293b; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .section { margin-bottom: 25px; padding: 15px; background: white; border-left: 4px solid #47c7c0; border-radius: 4px; }
          .section h3 { margin-top: 0; color: #47c7c0; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 8px; border-bottom: 1px solid #e5e5e5; }
          td:first-child { font-weight: bold; width: 200px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🚀 Nueva Farmacia Registrada en FarmaFácil</h2>
            <p>Fecha: ${new Date(data.fecha_registro).toLocaleString('es-ES')}</p>
          </div>
          <div class="content">
            <div class="section">
              <h3>📋 Datos Generales</h3>
              <table>
                <tr><td>Nombre comercial</td><td>${data.nombre_farmacia}</td></tr>
                <tr><td>CIF</td><td>${data.cif}</td></tr>
                <tr><td>Responsable</td><td>${data.responsable}</td></tr>
                <tr><td>Teléfono</td><td>${data.telefono}</td></tr>
                <tr><td>Email</td><td>${data.email}</td></tr>
                <tr><td>Dirección</td><td>${data.direccion}</td></tr>
                <tr><td>Horario</td><td>${data.horario}</td></tr>
                ${data.web ? `<tr><td>Web</td><td>${data.web}</td></tr>` : ''}
              </table>
            </div>

            <div class="section">
              <h3>🎨 Branding</h3>
              <table>
                <tr><td>Color primario</td><td><span style="display:inline-block;width:30px;height:30px;background:${data.color_primario};border:1px solid #ccc;vertical-align:middle;margin-right:10px;"></span>${data.color_primario}</td></tr>
                ${data.color_secundario ? `<tr><td>Color secundario</td><td><span style="display:inline-block;width:30px;height:30px;background:${data.color_secundario};border:1px solid #ccc;vertical-align:middle;margin-right:10px;"></span>${data.color_secundario}</td></tr>` : ''}
                ${data.logo_url ? `<tr><td>Logo</td><td><a href="${data.logo_url}">Ver logo</a></td></tr>` : ''}
              </table>
            </div>

            <div class="section">
              <h3>📦 Catálogo y Configuración</h3>
              <table>
                <tr><td>Modalidad de catálogo</td><td>${data.modalidad_catalogo}</td></tr>
                <tr><td>Mostrar precios</td><td>${data.mostrar_precios === 'si' ? '✅ Sí' : '❌ No'}</td></tr>
                <tr><td>Mostrar stock</td><td>${data.mostrar_stock === 'si' ? '✅ Sí' : '❌ No'}</td></tr>
                <tr><td>Necesita kiosko</td><td>${data.necesita_kiosko === 'si' ? '✅ Sí' : '❌ No'}</td></tr>
              </table>
            </div>

            ${data.necesita_kiosko === 'si' ? `
            <div class="section">
              <h3>🖥️ Kiosko</h3>
              <table>
                <tr><td>Dirección del kiosko</td><td>${data.direccion_kiosko || '-'}</td></tr>
                <tr><td>Responsable</td><td>${data.responsable_kiosko || '-'}</td></tr>
                <tr><td>Necesita instalación</td><td>${data.necesita_instalacion === 'si' ? '✅ Sí' : '❌ No'}</td></tr>
              </table>
            </div>
            ` : ''}

            <div class="section">
              <h3>🎁 Promociones y Marketing</h3>
              <table>
                <tr><td>Cupón de bienvenida</td><td>${data.cupon_bienvenida === 'si' ? '✅ Sí' : '❌ No'}</td></tr>
                ${data.texto_bienvenida ? `<tr><td>Texto de bienvenida</td><td>${data.texto_bienvenida}</td></tr>` : ''}
                ${data.tipo_promociones ? `<tr><td>Tipo de promociones</td><td>${data.tipo_promociones}</td></tr>` : ''}
              </table>
            </div>

            <div class="section">
              <h3>🤖 Asistente Virtual</h3>
              <table>
                <tr><td>Tono del asistente</td><td>${data.tono_asistente}</td></tr>
                <tr><td>Límites del asistente</td><td>${data.limites_asistente}</td></tr>
                <tr><td>Mensaje inicial</td><td>${data.mensaje_inicial_asistente}</td></tr>
              </table>
            </div>

            ${data.observaciones ? `
            <div class="section">
              <h3>📝 Observaciones</h3>
              <p>${data.observaciones}</p>
            </div>
            ` : ''}
          </div>
        </div>
      </body>
    </html>
  `;
}
