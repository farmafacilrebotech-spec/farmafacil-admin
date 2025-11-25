// utils/email/bienvenidaPDF.ts
export function plantillaBienvenidaPDF({
    nombre_farmacia,
    email_login,
    password,
  }: {
    nombre_farmacia: string;
    email_login: string;
    password: string;
  }) {
    return `
      <div style="font-family: Arial; font-size: 15px;">
        <h2>¡Bienvenidos a FarmaFácil!</h2>
  
        <p>Hola <b>${nombre_farmacia}</b>,</p>
  
        <p>Tu farmacia ya está registrada correctamente. Aquí tienes tus datos de acceso:</p>
  
        <p><b>Usuario:</b> ${email_login}<br>
           <b>Contraseña:</b> ${password}</p>
  
        <p>Adjuntamos tu PDF de bienvenida con el QR personalizado.</p>
  
        <p>Un saludo,<br>
        <b>Pilar – FarmaFácil / ReBoTech Solutions</b></p>
      </div>
    `;
  }
  