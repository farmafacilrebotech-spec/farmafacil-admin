import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { generarFarmaciaId } from '@/lib/farmaciaIdGenerator';
import { generarYSubirQR, generarQRBase64 } from '@/lib/qr';
import { enviarEmailBienvenida } from '@/lib/email';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extraer datos del formulario
    const nombre_farmacia = formData.get('nombre_farmacia') as string;
    const persona_contacto = formData.get('persona_contacto') as string;
    const telefono = formData.get('telefono') as string;
    const email = formData.get('email') as string;
    const provincia_id = formData.get('provincia_id') as string;
    const direccion = formData.get('direccion') as string || null;
    const instagram = formData.get('instagram') as string || null;
    const horario = formData.get('horario') as string || null;
    const color = formData.get('color') as string || '#1ABBB3';
    const mensaje_bienvenida = formData.get('mensaje_bienvenida') as string || null;
    const observaciones = formData.get('observaciones') as string || null;
    const logoFile = formData.get('logo') as File | null;

    // Validaciones básicas
    if (!nombre_farmacia || !persona_contacto || !telefono || !email || !provincia_id) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // PASO 1: Generar farmacia_id
    console.log('Generando farmacia_id...');
    const farmacia_id = await generarFarmaciaId();
    console.log('Farmacia ID generado:', farmacia_id);

    // PASO 2: Subir logo si existe
    let logo_url = null;
    if (logoFile) {
      console.log('Subiendo logo...');
      const logoBuffer = await logoFile.arrayBuffer();
      const logoExtension = logoFile.name.split('.').pop();
      const logoFileName = `${farmacia_id}.${logoExtension}`;

      const { data: logoData, error: logoError } = await supabaseAdmin.storage
        .from('farmacias-logos')
        .upload(logoFileName, logoBuffer, {
          contentType: logoFile.type,
          upsert: true,
        });

      if (logoError) {
        console.error('Error al subir logo:', logoError);
        throw new Error(`Error al subir logo: ${logoError.message}`);
      }

      // Obtener URL pública del logo
      const { data: logoPublicUrl } = supabaseAdmin.storage
        .from('farmacias-logos')
        .getPublicUrl(logoFileName);

      logo_url = logoPublicUrl.publicUrl;
      console.log('Logo subido:', logo_url);
    }

    // PASO 3: Generar y subir QR
    console.log('Generando QR...');
    const qr_url = await generarYSubirQR(farmacia_id);
    console.log('QR generado:', qr_url);

    // PASO 4: Insertar farmacia en la tabla
    console.log('Insertando farmacia en base de datos...');
    const { data: farmaciaData, error: farmaciaError } = await supabaseAdmin
      .from('farmacias')
      .insert({
        farmacia_id,
        nombre_farmacia,
        persona_contacto,
        telefono,
        email,
        provincia_id: parseInt(provincia_id),
        direccion,
        instagram,
        horario,
        color,
        logo_url,
        qr_url,
        mensaje_bienvenida,
        observaciones,
      })
      .select()
      .single();

    if (farmaciaError) {
      console.error('Error al insertar farmacia:', farmaciaError);
      throw new Error(`Error al crear farmacia: ${farmaciaError.message}`);
    }

    console.log('Farmacia insertada:', farmaciaData);

    // PASO 5: Crear credenciales
    console.log('Creando credenciales...');
    
    // Generar contraseña automática (8 caracteres aleatorios)
    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
    
    // Hash de la contraseña
    const password_hash = await bcrypt.hash(password, 10);

    const { error: credencialesError } = await supabaseAdmin
      .from('farmacias_credenciales')
      .insert({
        farmacia_id,
        email_login: email,
        password_hash,
      });

    if (credencialesError) {
      console.error('Error al crear credenciales:', credencialesError);
      throw new Error(`Error al crear credenciales: ${credencialesError.message}`);
    }

    console.log('Credenciales creadas');

    // PASO 6: Enviar email de bienvenida
    console.log('Enviando email de bienvenida...');
    try {
      const qrBase64 = await generarQRBase64(farmacia_id);
      
      await enviarEmailBienvenida({
        emailDestino: email,
        nombreFarmacia: nombre_farmacia,
        farmaciaId: farmacia_id,
        usuario: email,
        password: password,
        qrBase64: qrBase64,
      });

      console.log('Email enviado correctamente');
    } catch (emailError) {
      console.error('Error al enviar email:', emailError);
      // No lanzamos error aquí, la farmacia ya está creada
      // El email se puede reenviar más tarde
    }

    return NextResponse.json({
      success: true,
      farmaciaId: farmacia_id,
      message: 'Farmacia creada exitosamente',
    });

  } catch (error: any) {
    console.error('Error en proceso de creación:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

