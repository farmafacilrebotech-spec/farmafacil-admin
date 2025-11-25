'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReenviarCredencialesButtonProps {
  farmaciaId: string;
}

export function ReenviarCredencialesButton({ farmaciaId }: ReenviarCredencialesButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleReenviar = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/farmacias/reenviar-credenciales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ farmaciaId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al reenviar credenciales');
      }

      toast.success('Credenciales reenviadas', {
        description: 'El email ha sido enviado correctamente',
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al reenviar credenciales', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleReenviar}
      disabled={isLoading}
      variant="outline"
      className="flex items-center space-x-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Enviando...</span>
        </>
      ) : (
        <>
          <Mail className="h-4 w-4" />
          <span>Reenviar Credenciales</span>
        </>
      )}
    </Button>
  );
}

