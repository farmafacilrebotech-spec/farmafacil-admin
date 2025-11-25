'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowserClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Image from "next/image";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Error al iniciar sesión', {
          description: error.message,
        });
        return;
      }

      if (data.session) {
        toast.success('¡Bienvenido!');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1ABBB3] to-[#4ED3C2] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
           <div className="flex justify-center mb-4">
           <Image
               src="https://zvxxdmfljbtlenjatqgm.supabase.co/storage/v1/object/public/farmacias-logos/Farmafacil.png"
               alt="Logo FarmaFácil"
               width={80}
               height={80}
               className="object-contain"
               unoptimized={true}
              />

           </div>
          <CardTitle className="text-2xl font-bold">FarmaFácil</CardTitle>
          <CardDescription>Panel de Administración</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@farmafacil.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#1ABBB3] hover:bg-[#158f88]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

