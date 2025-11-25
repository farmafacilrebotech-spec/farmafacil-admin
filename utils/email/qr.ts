export function plantillaEnviarQR({ nombre_farmacia, farmacia_id }: any) {
    return `
      <div style="font-family: Arial; font-size: 15px;">
        <h2>📲 QR de tu Farmacia – FarmaFácil</h2>
  
        <p>Hola <b>${nombre_farmacia}</b>,</p>
  
        <p>Adjuntamos el archivo PDF con el QR oficial de tu farmacia:</p>
  
        <ul>
          <li><b>ID:</b> ${farmacia_id}</li>
        </ul>
  
        <p>Puedes imprimirlo y colocarlo donde prefieras.</p>
  
        <p>Gracias por confiar en FarmaFácil 💚</p>
      </div>
    `;
  }
  