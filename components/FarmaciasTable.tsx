'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Farmacia {
  farmacia_id: string;
  nombre_farmacia: string;
  persona_contacto: string;
  email: string;
  telefono: string;
  created_at: string;
  provincias?: {
    nombre: string;
  };
}

interface FarmaciasTableProps {
  farmacias: Farmacia[];
}

export function FarmaciasTable({ farmacias }: FarmaciasTableProps) {
  if (farmacias.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">No hay farmacias registradas</p>
        <Link href="/farmacias/nueva">
          <Button className="bg-[#1ABBB3] hover:bg-[#158f88]">
            Crear primera farmacia
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Farmacia</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Provincia</TableHead>
            <TableHead>Fecha Alta</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {farmacias.map((farmacia) => (
            <TableRow key={farmacia.farmacia_id}>
              <TableCell className="font-mono font-semibold">
                <Badge variant="secondary">{farmacia.farmacia_id}</Badge>
              </TableCell>
              <TableCell className="font-medium">{farmacia.nombre_farmacia}</TableCell>
              <TableCell>{farmacia.persona_contacto}</TableCell>
              <TableCell className="text-sm text-gray-600">{farmacia.email}</TableCell>
              <TableCell>
                {farmacia.provincias?.nombre || '-'}
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {format(new Date(farmacia.created_at), "d 'de' MMM, yyyy", { locale: es })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Link href={`/farmacias/${farmacia.farmacia_id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-[#1ABBB3] hover:text-white"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

