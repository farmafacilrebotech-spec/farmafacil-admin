import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { generarQRBase64 } from '@/lib/qr';
import { reenviarCredenciales } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { farmaciaId } = await request.json();

    if (!farmaciaId) {
      return NextResponse.json(
        { error: 'farmaciaId es requerido' },
        { status: 400 }
      );
    }

    // Obtener datos de la farmacia
    const { data: farmacia, error: farmaciaError } = await supabaseAdmin
      .from('farmacias')
      .select('*')
      .eq('farmacia_id', farmaciaId)
      .single();

    if (farmaciaError || !farmacia) {
      return NextResponse.json(
        { error: 'Farmacia no encontrada' },
        { status: 404 }
      );
    }

    // Obtener credenciales
    const { data: credenciales, error: credencialesError } = await supabaseAdmin
      .from('farmacias_credenciales')
      .select('email_login')
      .eq('farmacia_id', farmaciaId)
      .single();

    if (credencialesError || !credenciales) {
      return NextResponse.json(
        { error: 'Credenciales no encontradas' },
        { status: 404 }
      );
    }

    // Generar QR en base64
    const qrBase64 = await generarQRBase64(farmaciaId);

    // Nota: La contraseña original no se puede recuperar porque está hasheada
    // Generamos una nueva contraseña temporal
    const newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
    
    // Actualizar el hash en la base de datos
    const bcrypt = require('bcryptjs');
    const password_hash = await bcrypt.hash(newPassword, 10);
    
    await supabaseAdmin
      .from('farmacias_credenciales')
      .update({ password_hash })
      .eq('farmacia_id', farmaciaId);

    // Reenviar email con nueva contraseña
    await reenviarCredenciales({
      emailDestino: farmacia.email,
      nombreFarmacia: farmacia.nombre_farmacia,
      farmaciaId: farmacia.farmacia_id,
      usuario: credenciales.email_login,
      password: newPassword,
      qrBase64: qrBase64,
    });

    return NextResponse.json({
      success: true,
      message: 'Credenciales reenviadas correctamente con nueva contraseña',
    });

  } catch (error: any) {
    console.error('Error al reenviar credenciales:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

