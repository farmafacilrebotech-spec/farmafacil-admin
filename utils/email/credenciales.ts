export function plantillaReenvioCredenciales({
    nombre_farmacia,
    farmacia_id,
    email_acceso,
    password,
    url_panel,
    url_kiosko,
    url_clientes,
    qr_url
  }: any) {
  
    return `
      <div style="font-family: Arial; font-size: 15px;">
        <h2>🔐 Reenvío de credenciales – FarmaFácil</h2>
  
        <p>Hola <b>${nombre_farmacia}</b>,</p>
  
        <p>Aquí tienes de nuevo tus datos de acceso:</p>
  
        <ul>
          <li><b>ID Farmacia:</b> ${farmacia_id}</li>
          <li><b>Email de acceso:</b> ${email_acceso}</li>
          <li><b>Contraseña:</b> ${password}</li>
        </ul>
  
        <h3>📌 Enlaces importantes</h3>
  
        <p>
          <b>Panel de Farmacia:</b><br/>
          <a href="${url_panel}" target="_blank">${url_panel}</a>
        </p>
  
        <p>
          <b>Aplicación Clientes:</b><br/>
          <a href="${url_clientes}" target="_blank">${url_clientes}</a>
        </p>
  
        <p>
          <b>Kiosko QR:</b><br/>
          <a href="${url_kiosko}" target="_blank">${url_kiosko}</a>
        </p>
  
        ${qr_url ? `
          <h3>📲 QR de la Farmacia</h3>
          <img src="${qr_url}" width="200" style="border-radius: 12px;"/>
        ` : ""}
  
        <p>Si necesitas ayuda, estamos aquí para ti 💚</p>
      </div>
    `;
  }
  