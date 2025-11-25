import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Download, Instagram, Clock, MapPin, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { ReenviarCredencialesButton } from '@/components/ReenviarCredencialesButton';
import { EliminarFarmaciaButton } from '@/components/EliminarFarmaciaButton';
import { VolverButton } from '@/components/VolverButton';

async function getFarmacia(farmaciaId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_FARMACIA_PANEL_URL}/api/farmacias/detalle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: farmaciaId }),
    cache: "no-store",
  });

  const json = await res.json();
  return json.farmacia || null;
}

async function getCredenciales(farmaciaId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_FARMACIA_PANEL_URL}/api/farmacias/credenciales`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: farmaciaId }),
    cache: "no-store",
  });

  const json = await res.json();
  return json.credenciales || null;
}

export default async function FarmaciaDetailPage({ params }: { params: { id: string } }) {
  const farmacia = await getFarmacia(params.id);
  const credenciales = await getCredenciales(params.id);

  if (!farmacia) notFound();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <VolverButton />

            <div className="flex space-x-2">
              <ReenviarCredencialesButton farmaciaId={farmacia.farmacia_id} />
              <EliminarFarmaciaButton farmaciaId={farmacia.farmacia_id} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       
        {/* Título */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{farmacia.nombre_farmacia}</h1>
            <Badge className="text-lg px-3 py-1 bg-[#1ABBB3]">{farmacia.farmacia_id}</Badge>
          </div>

          <p className="text-gray-500">
            Registrada el {new Date(farmacia.created_at).toLocaleDateString("es-ES")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Info principal */}
          <div className="lg:col-span-2 space-y-6">

            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-[#1ABBB3]" />
                    <div>
                      <p className="text-sm text-gray-500">Persona de Contacto</p>
                      <p>{farmacia.persona_contacto}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-[#1ABBB3]" />
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p>{farmacia.telefono}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-[#1ABBB3]" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{farmacia.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-[#1ABBB3]" />
                    <div>
                      <p className="text-sm text-gray-500">Provincia</p>
                      <p>{farmacia.provincias?.nombre || "-"}</p>
                    </div>
                  </div>
                </div>

                {farmacia.direccion && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500 mb-1">Dirección</p>
                    <p>{farmacia.direccion}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información adicional… (continúa igual, no hace falta modificar más) */}
          </div>

          {/* Columna derecha - logo + QR */}
          <div className="space-y-6">
            {/* Igual que ya tenías */}
          </div>

        </div>
      </main>

    </div>
  );
}
