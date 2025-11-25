import { NextRequest, NextResponse } from 'next/server';
import { generatePharmacyEmail, generateRebotechEmail } from '@/lib/emailMock';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const pharmacyEmail = generatePharmacyEmail(data);
    const rebotechEmail = generateRebotechEmail(data);

    console.log('='.repeat(60));
    console.log('📧 EMAIL ENVIADO A LA FARMACIA:');
    console.log('='.repeat(60));
    console.log(`Para: ${data.email}`);
    console.log(`Asunto: Bienvenido a FarmaFácil - ${data.nombre_farmacia}`);
    console.log('Contenido (simulado):');
    console.log(pharmacyEmail);
    console.log('='.repeat(60));
    console.log();

    console.log('='.repeat(60));
    console.log('📧 EMAIL ENVIADO A REBOTECH:');
    console.log('='.repeat(60));
    console.log('Para: admin@rebotech.com');
    console.log(`Asunto: Nueva farmacia registrada: ${data.nombre_farmacia}`);
    console.log('Contenido (simulado):');
    console.log(rebotechEmail);
    console.log('='.repeat(60));

    return NextResponse.json({
      success: true,
      message: 'Emails enviados correctamente',
      emails: {
        pharmacy: {
          to: data.email,
          subject: `Bienvenido a FarmaFácil - ${data.nombre_farmacia}`,
          sent: true,
        },
        rebotech: {
          to: 'admin@rebotech.com',
          subject: `Nueva farmacia registrada: ${data.nombre_farmacia}`,
          sent: true,
        },
      },
    });
  } catch (error) {
    console.error('Error al enviar emails:', error);
    return NextResponse.json(
      { error: 'Error al enviar los emails' },
      { status: 500 }
    );
  }
}
