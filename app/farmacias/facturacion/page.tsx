"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const LOGO_FARMAFACIL =
  "https://zvxxdmfljbtlenjatqgm.supabase.co/storage/v1/object/public/farmacias-logos/Farmafacil.png";

const PLAN_PRECIOS: Record<string, number> = {
  Fidelización: 39,
  Starter: 59,
  Pro: 65,
  Enterprise: 75,
  Otros: 0,
};

export default function FacturacionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const farmaciaId = params.id;

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string>("Fidelización");
  const [cuotaMensual, setCuotaMensual] = useState<number>(
    PLAN_PRECIOS["Fidelización"]
  );

  const handlePlanChange = (value: string) => {
    setPlan(value);
    const precio = PLAN_PRECIOS[value] ?? 0;
    setCuotaMensual(precio);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/farmacias/contrato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          farmaciaId,
          razon_social: data.razon_social,
          cif_nif: data.cif_nif,
          direccion_fiscal: data.direccion_fiscal,
          email_facturacion: data.email_facturacion,
          telefono_facturacion: data.telefono_facturacion,
          titular_cuenta: data.titular_cuenta,
          iban: data.iban,
          dia_cobro_preferente: data.dia_cobro_preferente,
          metodo_pago_inicial: data.metodo_pago_inicial,
          plan,
          cuota_mensual_custom: plan === "Otros" ? data.cuota_mensual : cuotaMensual,
          cuota_alta: data.cuota_alta,
        }),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || "Error al guardar facturación");
      }

      toast.success("Facturación guardada y contrato generado");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error al guardar facturación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">
            Facturación y Contrato
          </CardTitle>
          <img src={LOGO_FARMAFACIL} className="w-16 h-auto" alt="FarmaFácil" />
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Datos fisc ales */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Datos de facturación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Razón social</Label>
                  <Input name="razon_social" required />
                </div>
                <div>
                  <Label>CIF / NIF</Label>
                  <Input name="cif_nif" required />
                </div>
                <div>
                  <Label>Dirección fiscal</Label>
                  <Input name="direccion_fiscal" required />
                </div>
                <div>
                  <Label>Email de facturación</Label>
                  <Input
                    name="email_facturacion"
                    type="email"
                    required
                  />
                </div>
                <div>
                  <Label>Teléfono de facturación</Label>
                  <Input name="telefono_facturacion" />
                </div>
              </div>
            </section>

            {/* Plan y cuotas */}
            <section className="space-y-4 border-t pt-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Plan y cuotas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Plan contratado</Label>
                  <select
                    name="plan"
                    className="border rounded-md p-2 w-full"
                    value={plan}
                    onChange={(e) => handlePlanChange(e.target.value)}
                  >
                    <option value="Fidelización">Fidelización (39€/mes)</option>
                    <option value="Starter">Starter (59€/mes)</option>
                    <option value="Pro">Pro (65€/mes)</option>
                    <option value="Enterprise">Enterprise (75€/mes)</option>
                    <option value="Otros">Otros precios</option>
                  </select>
                </div>
                <div>
                  <Label>Cuota mensual</Label>
                  <Input
                    name="cuota_mensual"
                    type="number"
                    step="0.01"
                    value={plan === "Otros" ? undefined : cuotaMensual}
                    defaultValue={plan === "Otros" ? undefined : cuotaMensual}
                    onChange={(e) =>
                      plan === "Otros" &&
                      setCuotaMensual(Number(e.target.value || 0))
                    }
                    placeholder={
                      plan === "Otros"
                        ? "Introduce la cuota mensual"
                        : cuotaMensual.toString()
                    }
                  />
                </div>
                <div>
                  <Label>Cuota personalización inicial (€)</Label>
                  <Input
                    name="cuota_alta"
                    type="number"
                    step="0.01"
                    placeholder="Ej: 69.00"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label>Día de cobro preferente</Label>
                  <select
                    name="dia_cobro_preferente"
                    className="border rounded-md p-2 w-full"
                    defaultValue="1"
                  >
                    <option value="1">1</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                </div>
                <div>
                  <Label>Método pago recurrente</Label>
                  <Input
                    disabled
                    value="Domiciliación bancaria"
                  />
                </div>
                <div>
                  <Label>Método pago personalización inicial</Label>
                  <select
                    name="metodo_pago_inicial"
                    className="border rounded-md p-2 w-full"
                    defaultValue="tarjeta"
                    required
                  >
                    <option value="tarjeta">Tarjeta</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="bizum">Bizum</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Banco */}
            <section className="space-y-4 border-t pt-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Datos bancarios para domiciliación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Titular de la cuenta</Label>
                  <Input name="titular_cuenta" required />
                </div>
                <div>
                  <Label>IBAN</Label>
                  <Input name="iban" required />
                </div>
              </div>
            </section>

            <div className="flex justify-end pt-4 border-t">
              <Button
                type="submit"
                className="bg-[#1ABBB3] hover:bg-[#158f88]"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar y generar contrato"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
