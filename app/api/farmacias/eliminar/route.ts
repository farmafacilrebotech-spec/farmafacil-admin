import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function DELETE(request: NextRequest) {
  try {
    const { farmaciaId } = await request.json();

    if (!farmaciaId) {
      return NextResponse.json(
        { error: 'farmaciaId es requerido' },
        { status: 400 }
      );
    }

    // Obtener la farmacia para saber qué archivos eliminar
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

    // Eliminar logo del storage si existe
    if (farmacia.logo_url) {
      try {
        const logoPath = farmacia.logo_url.split('/').pop();
        if (logoPath) {
          await supabaseAdmin.storage
            .from('farmacias-logos')
            .remove([logoPath]);
        }
      } catch (error) {
        console.error('Error al eliminar logo:', error);
        // Continuamos aunque falle la eliminación del logo
      }
    }

    // Eliminar QR del storage
    try {
      const qrFileName = `${farmaciaId}.png`;
      await supabaseAdmin.storage
        .from('farmacias-qr')
        .remove([qrFileName]);
    } catch (error) {
      console.error('Error al eliminar QR:', error);
      // Continuamos aunque falle la eliminación del QR
    }

    // Eliminar credenciales (se eliminará por CASCADE pero lo hacemos explícito)
    await supabaseAdmin
      .from('farmacias_credenciales')
      .delete()
      .eq('farmacia_id', farmaciaId);

    // Eliminar farmacia (esto debe eliminar las credenciales por CASCADE si está configurado)
    const { error: deleteError } = await supabaseAdmin
      .from('farmacias')
      .delete()
      .eq('farmacia_id', farmaciaId);

    if (deleteError) {
      throw new Error(`Error al eliminar farmacia: ${deleteError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Farmacia eliminada correctamente',
    });

  } catch (error: any) {
    console.error('Error al eliminar farmacia:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

