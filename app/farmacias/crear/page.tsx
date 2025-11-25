"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function CrearFarmaciaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div
      className="
        min-h-screen w-full
        bg-[radial-gradient(circle_at_top_left,#E6FAF8,#FFFFFF)]
        py-10 flex justify-center
      "
    >
      <div className="max-w-5xl w-full px-6">
        {/* CABECERA */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white bg-[#1ABBB3] hover:bg-[#159e96] 
                       text-sm px-4 py-2 rounded-md shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>

          <h1 className="text-3xl font-bold text-gray-900 text-center flex-1">
            Nueva Farmacia
          </h1>

          <Image
            src="https://zvxxdmfljbtlenjatqgm.supabase.co/storage/v1/object/public/farmacias-logos/Farmafacil.png"
            width={70}
            height={70}
            alt="FarmaFácil"
            className="object-contain"
          />
        </div>

        <p className="text-center text-gray-500 mb-8">
          Completa el formulario para dar de alta una nueva farmacia
        </p>

        {/* CARD */}
        <Card className="shadow-md border bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl">Datos de la Farmacia</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);

                try {
                  const form = e.currentTarget;
                  const formData = new FormData(form);

                  const resp = await fetch("/api/farmacias/crear", {
                    method: "POST",
                    body: formData,
                  });

                  const data = await resp.json();

                  if (!resp.ok) {
                    console.error(data);
                    toast.error(data.error || "Error al crear la farmacia");
                    return;
                  }

                  toast.success("Farmacia creada correctamente");
                  router.push("/panel/farmacias");
                } catch (err) {
                  console.error(err);
                  toast.error("Error al crear la farmacia");
                } finally {
                  setLoading(false);
                }
              }}
              className="space-y-8"
            >
              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Nombre de la Farmacia *</Label>
                  <Input
                    name="nombre_farmacia"
                    placeholder="Farmacia San José"
                    required
                  />
                </div>

                <div>
                  <Label>Persona de Contacto *</Label>
                  <Input
                    name="persona_contacto"
                    placeholder="Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <Label>Teléfono *</Label>
                  <Input
                    name="telefono"
                    placeholder="912345678"
                    required
                  />
                </div>

                <div>
                  <Label>Email *</Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="contacto@farmacia.com"
                    required
                  />
                </div>

                <div>
                <Label>Dirección *</Label>
                  <Input
                    name="direccion"
                    placeholder="Calle Principal 123"
                    required
                  />
                </div>

                <div>
                <Label>Provincia *</Label>
                  <Input
                    name="provincia_texto"
                    placeholder="Valencia"
                    required
                   />
                </div>

                <div>
                  <Label>Instagram</Label>
                  <Input
                    name="instagram"
                    placeholder="@farmacialopez"
                  />
                </div>

                <div>
                  <Label>Horario</Label>
                  <Textarea
                    name="horario"
                    placeholder="L-V 9:00-20:00, S 9:00-14:00"
                    defaultValue="L-V 9:00-13:30 y 17:00-20:00, S 9:00-14:00"
                  />
                </div>

                <div>
                  <Label>Color Corporativo</Label>
                  <Input
                    name="color"
                    type="color"
                    defaultValue="#1ABBB3"
                  />
                </div>

                <div>
                  <Label>Logo *</Label>
                  <Input
                    name="logo"
                    type="file"
                    accept="image/*"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, SVG. Máx 5MB. Obligatorio para generar el PDF.
                  </p>
                </div>
              </div>

              <div>
                <Label>Mensaje de Bienvenida</Label>
                <Textarea
                  name="mensaje_bienvenida"
                  placeholder="Bienvenido a nuestra farmacia"
                />
              </div>

              <div>
                <Label>Observaciones Internas</Label>
                <Textarea
                  name="observaciones"
                  placeholder="Notas privadas"
                />
              </div>

              {/* BOTONES */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  className="bg-[#1ABBB3] hover:bg-[#159e96]"
                  disabled={loading}
                >
                  {loading ? "Creando..." : "Crear Farmacia"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}