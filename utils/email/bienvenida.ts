export function plantillaBienvenida({ nombre_farmacia, emailLogin, password }: any) {
    return `
      <div style="font-family: Arial; font-size: 15px;">
        <h2>📄 Bienvenida a FarmaFácil - ${nombre_farmacia}</h2>
  
        <p>Hola <b>${nombre_farmacia}</b>,</p>
  
        <p>Te damos la bienvenida a FarmaFácil.</p>
  
        <p>Aquí tienes tus credenciales de acceso al panel de control:</p>
  
        <ul>
          <li><b>Usuario:</b> ${emailLogin}</li>
          <li><b>Contraseña:</b> ${password}</li>
        </ul>
  
        <p>💚 Gracias por confiar en FarmaFácil</p>
      </div>
    `;
  }
  