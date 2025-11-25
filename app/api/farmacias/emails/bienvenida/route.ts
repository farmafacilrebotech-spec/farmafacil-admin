
    import { NextResponse } from "next/server";
    import { Resend } from "resend";
    
    export const runtime = "nodejs"; // ⬅️ obligatorio para Resend
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    export async function POST(req: Request) {
      try {
        const { email, nombre_farmacia, farmacia_id } = await req.json();
  
      //Cuando tengamos programado el sistema de citas, cambiar el enlace a la página de citas
      //  const enlaceCita = `${process.env.NEXT_PUBLIC_FARMACIA_PANEL_URL}/cita/${farmacia_id}`;
      //           <a href="${enlaceCita}"  --> <a href="https://calendly.com/farmafacil/onboarding-farmafacil"
        const html = `
          <div style="font-family: Arial; font-size: 15px;">
            <h2>¡Bienvenidos a FarmaFácil!</h2>
            <p>Hola <b>${nombre_farmacia}</b>,</p>
            <p>Tu farmacia ya está registrada correctamente en la plataforma.</p>

              <p>🔔 Antes de continuar, te recomendamos reservar una breve sesión de bienvenida
                    para revisar los accesos y activar tu catálogo.</p>

              <p>
                   <a href="https://calendly.com/farmafacil/bienvenida"
                   style="display:inline-block; background:#1abbb3; color:#ffffff; padding:12px 18px; border-radius:6px; text-decoration:none; font-weight:bold;">
                   Reservar cita ahora 📅
                 </a>
              </p>

            <p>Gracias por confiar en FarmaFácil 💚</p>

          </div>
        `;
    
        const data = await resend.emails.send({
          from: "FarmaFácil <noreply@farmafacil.app>",
          to: email,
          subject: "Bienvenido a FarmaFácil",
          html,
        });
    
        return NextResponse.json({ ok: true, data });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 });
      }
    }
    