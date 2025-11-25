'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Upload, Instagram } from 'lucide-react';
import { Provincia } from '@/lib/supabaseClient';

const farmaciaSchema = z.object({
  nombre_farmacia: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  persona_contacto: z.string().min(3, 'El nombre de contacto es requerido'),
  telefono: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos'),
  email: z.string().email('Email inválido'),
  provincia_id: z.string().min(1, 'Selecciona una provincia'),
  direccion: z.string().optional(),
  instagram: z.string().optional(),
  horario: z.string().optional(),
  color: z.string().optional(),
  mensaje_bienvenida: z.string().optional(),
  observaciones: z.string().optional(),
});

type FarmaciaFormData = z.infer<typeof farmaciaSchema>;

interface FarmaciaFormProps {
  provincias: Provincia[];
}

export function FarmaciaForm({ provincias }: FarmaciaFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FarmaciaFormData>({
    resolver: zodResolver(farmaciaSchema),
    defaultValues: {
      color: '#1ABBB3',
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FarmaciaFormData) => {
    setIsSubmitting(true);

    try {
      // Crear FormData para enviar todo al API
      const formData = new FormData();
      
      // Añadir datos del formulario
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value.toString());
        }
      });

      // Añadir logo si existe
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      // Enviar al API
      const response = await fetch('/api/farmacias/nueva', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear la farmacia');
      }

      toast.success('¡Farmacia creada exitosamente!', {
        description: `Código: ${result.farmaciaId}`,
      });

      // Redirigir al detalle de la farmacia
      router.push(`/farmacias/${result.farmaciaId}`);
    } catch (error: any) {
      console.error('Error al crear farmacia:', error);
      toast.error('Error al crear la farmacia', {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Información Básica */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre_farmacia">
              Nombre de la Farmacia <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre_farmacia"
              placeholder="Farmacia San José"
              {...register('nombre_farmacia')}
              disabled={isSubmitting}
            />
            {errors.nombre_farmacia && (
              <p className="text-sm text-red-500">{errors.nombre_farmacia.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="persona_contacto">
              Persona de Contacto <span className="text-red-500">*</span>
            </Label>
            <Input
              id="persona_contacto"
              placeholder="Juan Pérez"
              {...register('persona_contacto')}
              disabled={isSubmitting}
            />
            {errors.persona_contacto && (
              <p className="text-sm text-red-500">{errors.persona_contacto.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">
              Teléfono <span className="text-red-500">*</span>
            </Label>
            <Input
              id="telefono"
              placeholder="912345678"
              {...register('telefono')}
              disabled={isSubmitting}
            />
            {errors.telefono && (
              <p className="text-sm text-red-500">{errors.telefono.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="contacto@farmacia.com"
              {...register('email')}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="provincia_id">
              Provincia <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(value) => setValue('provincia_id', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una provincia" />
              </SelectTrigger>
              <SelectContent>
                {provincias.map((provincia) => (
                  <SelectItem key={provincia.id} value={provincia.id.toString()}>
                    {provincia.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.provincia_id && (
              <p className="text-sm text-red-500">{errors.provincia_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              placeholder="Calle Principal 123"
              {...register('direccion')}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900">Información Adicional</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="instagram"
                placeholder="@farmacia"
                className="pl-10"
                {...register('instagram')}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color Corporativo</Label>
            <div className="flex space-x-2">
              <Input
                id="color"
                type="color"
                {...register('color')}
                disabled={isSubmitting}
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                value={watch('color') || '#1ABBB3'}
                readOnly
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="horario">Horario</Label>
            <Textarea
              id="horario"
              placeholder="Lunes a Viernes: 9:00 - 21:00&#10;Sábados: 10:00 - 14:00"
              rows={3}
              {...register('horario')}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="mensaje_bienvenida">Mensaje de Bienvenida</Label>
            <Textarea
              id="mensaje_bienvenida"
              placeholder="Bienvenido a nuestra farmacia..."
              rows={3}
              {...register('mensaje_bienvenida')}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="observaciones">Observaciones (uso interno)</Label>
            <Textarea
              id="observaciones"
              placeholder="Notas internas sobre la farmacia..."
              rows={3}
              {...register('observaciones')}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900">Logo</h3>
        
        <div className="space-y-2">
          <Label htmlFor="logo">Logo de la Farmacia</Label>
          <div className="flex items-center space-x-4">
            {logoPreview && (
              <div className="w-24 h-24 rounded-lg border-2 border-gray-200 overflow-hidden">
                <img
                  src={logoPreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                disabled={isSubmitting}
                className="cursor-pointer"
              />
              <p className="text-sm text-gray-500 mt-1">
                Formatos aceptados: JPG, PNG, SVG. Máximo 5MB.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-[#1ABBB3] hover:bg-[#158f88]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando farmacia...
            </>
          ) : (
            'Crear Farmacia'
          )}
        </Button>
      </div>
    </form>
  );
}

