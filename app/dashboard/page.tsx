import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Building2, LogOut } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from '@/components/LogoutButton';
import { FarmaciasTable } from '@/components/FarmaciasTable';

export const dynamic = 'force-dynamic';

async function getFarmacias() {
  const { data, error } = await supabase
    .from('farmacias')
    .select(`
      *,
      provincias:provincia_id (
        nombre
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener farmacias:', error);
    return [];
  }

  return data || [];
}

export default async function DashboardPage() {
  const farmacias = await getFarmacias();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              {/*<div className="w-10 h-10 bg-[#1ABBB3] rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">FF</span>
              </div>*/}
              <div className="flex justify-center mb-4">
                <img 
                  src="https://zvxxdmfljbtlenjatqgm.supabase.co/storage/v1/object/public/farmacias-logos/Farmafacil.png"
                  alt="Logo FarmaFácil"
                  className="w-20 h-20 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Panel de Administración
                </h1>
                <p className="text-sm text-gray-500">FarmaFácil</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Farmacias</CardDescription>
              <CardTitle className="text-4xl">{farmacias.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Nuevas este mes</CardDescription>
              <CardTitle className="text-4xl">
                {farmacias.filter(f => {
                  const created = new Date(f.created_at);
                  const now = new Date();
                  return created.getMonth() === now.getMonth() && 
                         created.getFullYear() === now.getFullYear();
                }).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-br from-[#1ABBB3] to-[#4ED3C2] text-white">
            <CardHeader className="pb-3">
              <CardDescription className="text-white/90">Acción Rápida</CardDescription>
              <Link href="/farmacias/nueva">
                <Button 
                  className="w-full bg-white text-[#1ABBB3] hover:bg-gray-100 mt-2"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Nueva Farmacia
                </Button>
              </Link>
            </CardHeader>
          </Card>
        </div>

        {/* Farmacias Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Farmacias Registradas</CardTitle>
                <CardDescription>
                  Gestiona todas las farmacias del sistema
                </CardDescription>
              </div>
              <Link href="/farmacias/nueva">
                <Button className="bg-[#1ABBB3] hover:bg-[#158f88]">
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Farmacia
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <FarmaciasTable farmacias={farmacias} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

