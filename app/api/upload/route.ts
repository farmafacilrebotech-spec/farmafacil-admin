import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se encontró ningún archivo' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64 = buffer.toString('base64');
    const mimeType = file.type;
    const dataUrl = `data:${mimeType};base64,${base64}`;

    console.log('Archivo subido (mock):', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    return NextResponse.json({
      success: true,
      url: dataUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Error al procesar la subida:', error);
    return NextResponse.json(
      { error: 'Error al procesar el archivo' },
      { status: 500 }
    );
  }
}
