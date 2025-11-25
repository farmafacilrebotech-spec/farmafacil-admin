'use client';

import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowserClient';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabaseBrowser.auth.signOut();
      
      if (error) {
        toast.error('Error al cerrar sesión', {
          description: error.message,
        });
        return;
      }

      toast.success('Sesión cerrada correctamente');
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error inesperado al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center space-x-2"
    >
      <LogOut className="h-4 w-4" />
      <span>{isLoading ? 'Cerrando...' : 'Cerrar Sesión'}</span>
    </Button>
  );
}
