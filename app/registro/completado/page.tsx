import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Home } from 'lucide-react';

export default function CompletadoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            ¡Registro enviado correctamente!
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Hemos recibido tu solicitud de registro en FarmaFácil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
            <h3 className="font-semibold text-teal-900 mb-2">¿Qué sigue ahora?</h3>
            <ul className="space-y-2 text-teal-800">
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span>Recibirás un email de confirmación en los próximos minutos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">👥</span>
                <span>Nuestro equipo revisará tu información</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📞</span>
                <span>Te contactaremos en 24-48 horas para activar tu farmacia</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🚀</span>
                <span>¡Comenzarás a disfrutar de todos los beneficios de FarmaFácil!</span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Si tienes alguna duda o necesitas asistencia inmediata, puedes contactarnos en:
            </p>
            <p className="font-semibold text-gray-900">
              📧 soporte@farmafacil.com
              <br />
              📞 900 123 456
            </p>
          </div>

          <div className="flex justify-center pt-4">
            <Link href="/">
              <Button className="bg-[#47c7c0] hover:bg-[#3ab3ac] text-white">
                <Home className="mr-2 h-4 w-4" />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
