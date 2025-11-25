// lib/whatsapp.ts

const WHAPI_BASE_URL =
  process.env.WHAPI_BASE_URL || "https://gate.whapi.cloud";
const WHAPI_TOKEN = process.env.WHAPI_TOKEN;
const WHAPI_CHANNEL_ID = process.env.WHAPI_CHANNEL_ID;

if (!WHAPI_TOKEN || !WHAPI_CHANNEL_ID) {
  console.warn("[WhatsApp] Falta WHAPI_TOKEN o WHAPI_CHANNEL_ID en .env.local");
}

interface WhatsappAltaData {
  telefono: string;       // Siempre 346XXXXXXXX sin +
  nombreFarmacia: string;
  email: string;
  password: string;
  farmaciaId: string;
}

export async function enviarWhatsappAltaFarmacia(
  data: WhatsappAltaData
): Promise<void> {
  if (!WHAPI_TOKEN || !WHAPI_CHANNEL_ID) return;

  let { telefono, nombreFarmacia, email, password, farmaciaId } = data;

  // Normalizar teléfono
  telefono = telefono.replace("+", "");

  const url = `${WHAPI_BASE_URL}/messages/text`;

  const body = {
    channel_id: WHAPI_CHANNEL_ID,
    to: telefono,
    body:
      `Hola ${nombreFarmacia} 👋💚\n\n` +
      `Tu farmacia ha sido dada de alta correctamente en *FarmaFácil*.\n\n` +
      `🔐 *Datos de acceso al Panel de Gestión:*\n` +
      `Usuario: ${email}\n` +
      `Contraseña: ${password}\n\n` +
      `🧾 *Código interno de farmacia:* ${farmaciaId}\n\n` +
      `Tu QR personalizado te lo entregaré en el PDF de bienvenida.\n\n` +
      `Cualquier duda, estoy aquí para ayudarte 😊`,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const dataRes = await response.json();
    console.log("[WhatsApp] Respuesta:", dataRes);

    if (!response.ok) {
      console.error(
        "[WhatsApp] Error en el envío:",
        response.status,
        JSON.stringify(dataRes, null, 2)
      );
    }
  } catch (err) {
    console.error("[WhatsApp] Error de red:", err);
  }
}
