export function plantillaEnviarContrato({ nombre_farmacia }: any) {
    return `
      <div style="font-family: Arial; font-size: 15px;">
        <h2>📄 Contrato de servicio – FarmaFácil</h2>
  
        <p>Hola <b>${nombre_farmacia}</b>,</p>
  
        <p>Te enviamos adjunto el contrato oficial para tu farmacia.</p>
  
        <p>Revísalo cuando quieras y contáctanos si necesitas cualquier aclaración.</p>
  
        <p>💚 Gracias por confiar en FarmaFácil</p>
      </div>
    `;
  }
  