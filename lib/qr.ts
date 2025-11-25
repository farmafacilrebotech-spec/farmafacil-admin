import QRCode from 'qrcode';
import { supabaseAdmin } from './supabaseClient';

/**
 * Genera un código QR para una farmacia y lo sube a Supabase Storage
 * @param farmaciaId - ID de la farmacia (ej: FF00001-25)
 * @returns URL pública del QR almacenado
 */
export async function generarYSubirQR(farmaciaId: string): Promise<string> {
  try {
    // URL a la que apuntará el QR
    const clienteUrl = process.env.NEXT_PUBLIC_CLIENTE_URL || 'https://farmafacil-clientes.netlify.app';
    const qrUrl = `${clienteUrl}/farmacia/${farmaciaId}`;

    // Generar QR como buffer
    const qrBuffer = await QRCode.toBuffer(qrUrl, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 500,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Subir a Supabase Storage
    const fileName = `${farmaciaId}.png`;
    const { data, error } = await supabaseAdmin.storage
      .from('farmacias-qr')
      .upload(fileName, qrBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      throw new Error(`Error al subir QR: ${error.message}`);
    }

    // Obtener URL pública
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('farmacias-qr')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error generando QR:', error);
    throw error;
  }
}

/**
 * Genera un QR como data URL (base64) para usar en emails
 */
export async function generarQRBase64(farmaciaId: string): Promise<string> {
  const clienteUrl = process.env.NEXT_PUBLIC_CLIENTE_URL || 'https://farmafacil-clientes.netlify.app';
  const qrUrl = `${clienteUrl}/farmacia/${farmaciaId}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: 'H',
      width: 500,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return qrDataUrl;
  } catch (error) {
    console.error('Error generando QR base64:', error);
    throw error;
  }
}

