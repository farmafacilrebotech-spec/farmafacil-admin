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

export async function sendToGoogleSheet(data: RegistroData): Promise<void> {
  const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL ||
                     'https://script.google.com/macros/s/YOUR_WEBHOOK_ID/exec';

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      mode: 'no-cors',
    });

    console.log('Datos enviados a Google Sheets:', data);
  } catch (error) {
    console.error('Error al enviar datos a Google Sheets:', error);
    throw error;
  }
}
