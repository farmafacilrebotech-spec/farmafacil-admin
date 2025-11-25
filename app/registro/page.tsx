'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { sendToGoogleSheet } from '@/lib/googleSheet';
import { Loader2, Upload, X } from 'lucide-react';

export default function RegistroPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre_farmacia: '',
    cif: '',
    responsable: '',
    telefono: '',
    email: '',
    direccion: '',
    horario: '',
    web: '',
    color_primario: '#47c7c0',
    color_secundario: '',
    modalidad_catalogo: '',
    mostrar_precios: 'si',
    mostrar_stock: 'si',
    necesita_kiosko: 'no',
    direccion_kiosko: '',
    responsable_kiosko: '',
    necesita_instalacion: 'no',
    cupon_bienvenida: 'si',
    texto_bienvenida: '',
    tipo_promociones: '',
    tono_asistente: '',
    limites_asistente: '',
    mensaje_inicial_asistente: '',
    observaciones: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const removeFile = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let logoUrl = '';

      if (logoFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', logoFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          logoUrl = uploadData.url;
        }
      }

      const registroData = {
        ...formData,
        logo_url: logoUrl,
        fecha_registro: new Date().toISOString(),
      };

      await sendToGoogleSheet(registroData);

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registroData),
      });

      router.push('/registro/completado');
    } catch (error) {
      console.error('Error al enviar el registro:', error);
      alert('Hubo un error al procesar tu registro. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Registro de Nueva Farmacia</h1>
          <p className="text-gray-600">Completa todos los campos para unirte a FarmaFácil</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="bg-[#47c7c0] text-white">
              <CardTitle>Datos Generales</CardTitle>
              <CardDescription className="text-teal-50">Información básica de la farmacia</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre_farmacia">Nombre comercial de la farmacia *</Label>
                  <Input
                    id="nombre_farmacia"
                    required
                    value={formData.nombre_farmacia}
                    onChange={(e) => handleInputChange('nombre_farmacia', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cif">CIF *</Label>
                  <Input
                    id="cif"
                    required
                    value={formData.cif}
                    onChange={(e) => handleInputChange('cif', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsable">Responsable / Persona de contacto *</Label>
                  <Input
                    id="responsable"
                    required
                    value={formData.responsable}
                    onChange={(e) => handleInputChange('responsable', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  required
                  value={formData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horario">Horario habitual </Label>
                  <Input
                    id="horario"
                    placeholder="Ej: L-V 9:00-20:00, S 9:00-14:00"
                    value={formData.horario}
                    onChange={(e) => handleInputChange('horario', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="web">Sitio web (opcional)</Label>
                  <Input
                    id="web"
                    type="url"
                    placeholder="https://..."
                    value={formData.web}
                    onChange={(e) => handleInputChange('web', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-emerald-500 text-white">
              <CardTitle>Branding</CardTitle>
              <CardDescription className="text-emerald-50">Personaliza la imagen de tu farmacia</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo">Logo de la farmacia *</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="logo"
                    required={true}
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="logo"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Seleccionar archivo
                  </Label>
                  {logoFile && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{logoFile.name}</span>
                      <button type="button" onClick={removeFile} className="text-red-500 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                {logoPreview && (
                  <div className="mt-2">
                    <img src={logoPreview} alt="Preview" className="h-20 w-20 object-contain border rounded" />
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color_primario">Color primario *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color_primario"
                      type="color"
                      value={formData.color_primario}
                      onChange={(e) => handleInputChange('color_primario', e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.color_primario}
                      onChange={(e) => handleInputChange('color_primario', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color_secundario">Color secundario (opcional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color_secundario"
                      type="color"
                      value={formData.color_secundario}
                      onChange={(e) => handleInputChange('color_secundario', e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.color_secundario}
                      onChange={(e) => handleInputChange('color_secundario', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-amber-500 text-white">
              <CardTitle>Catálogo y Configuración</CardTitle>
              <CardDescription className="text-amber-50">Gestión de productos e inventario</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modalidad_catalogo">Modalidad de catálogo *</Label>
                <Select
                  required
                  value={formData.modalidad_catalogo}
                  onValueChange={(value) => handleInputChange('modalidad_catalogo', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fmas">FMAS</SelectItem>
                    <SelectItem value="excel_csv">Excel / CSV</SelectItem>
                    <SelectItem value="sistema_propio">Sistema propio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>¿Mostrar precios? *</Label>
                  <RadioGroup
                    value={formData.mostrar_precios}
                    onValueChange={(value) => handleInputChange('mostrar_precios', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id="precios_si" />
                      <Label htmlFor="precios_si">Sí</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="precios_no" />
                      <Label htmlFor="precios_no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>¿Mostrar stock? *</Label>
                  <RadioGroup
                    value={formData.mostrar_stock}
                    onValueChange={(value) => handleInputChange('mostrar_stock', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id="stock_si" />
                      <Label htmlFor="stock_si">Sí</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="stock_no" />
                      <Label htmlFor="stock_no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Necesita kiosko físico *</Label>
                  <RadioGroup
                    value={formData.necesita_kiosko}
                    onValueChange={(value) => handleInputChange('necesita_kiosko', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id="kiosko_si" />
                      <Label htmlFor="kiosko_si">Sí</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="kiosko_no" />
                      <Label htmlFor="kiosko_no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          {formData.necesita_kiosko === 'si' && (
            <Card>
              <CardHeader className="bg-violet-500 text-white">
                <CardTitle>Kiosko</CardTitle>
                <CardDescription className="text-violet-50">Configuración del kiosko físico</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="direccion_kiosko">Dirección donde estará el kiosko *</Label>
                  <Input
                    id="direccion_kiosko"
                    required
                    value={formData.direccion_kiosko}
                    onChange={(e) => handleInputChange('direccion_kiosko', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsable_kiosko">Persona responsable del kiosko *</Label>
                  <Input
                    id="responsable_kiosko"
                    required
                    value={formData.responsable_kiosko}
                    onChange={(e) => handleInputChange('responsable_kiosko', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>¿Necesita instalación física? *</Label>
                  <RadioGroup
                    value={formData.necesita_instalacion}
                    onValueChange={(value) => handleInputChange('necesita_instalacion', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id="instalacion_si" />
                      <Label htmlFor="instalacion_si">Sí</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="instalacion_no" />
                      <Label htmlFor="instalacion_no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="bg-rose-500 text-white">
              <CardTitle>Promociones y Marketing</CardTitle>
              <CardDescription className="text-rose-50">Gestión de ofertas y promociones</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>¿Desea cupón de bienvenida? *</Label>
                <RadioGroup
                  value={formData.cupon_bienvenida}
                  onValueChange={(value) => handleInputChange('cupon_bienvenida', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="cupon_si" />
                    <Label htmlFor="cupon_si">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="cupon_no" />
                    <Label htmlFor="cupon_no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="texto_bienvenida">Texto para el mensaje de bienvenida (opcional)</Label>
                <Textarea
                  id="texto_bienvenida"
                  placeholder="Ej: ¡Bienvenido a nuestra farmacia! Disfruta de un 10% de descuento en tu primera compra."
                  value={formData.texto_bienvenida}
                  onChange={(e) => handleInputChange('texto_bienvenida', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_promociones">Tipo de promociones actuales (opcional)</Label>
                <Textarea
                  id="tipo_promociones"
                  placeholder="Describe las promociones que sueles ofrecer"
                  value={formData.tipo_promociones}
                  onChange={(e) => handleInputChange('tipo_promociones', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-cyan-600 text-white">
              <CardTitle>Asistente Virtual</CardTitle>
              <CardDescription className="text-cyan-50">Personalización del asistente para tus clientes</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tono_asistente">Tono del asistente *</Label>
                <Select
                  required
                  value={formData.tono_asistente}
                  onValueChange={(value) => handleInputChange('tono_asistente', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tono" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cercano">Cercano</SelectItem>
                    <SelectItem value="profesional">Profesional</SelectItem>
                    <SelectItem value="muy_tecnico">Muy técnico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limites_asistente">Límites deseados del asistente *</Label>
                <Textarea
                  id="limites_asistente"
                  placeholder="Describe qué temas debe evitar o cómo debe comportarse el asistente"
                  required
                  value={formData.limites_asistente}
                  onChange={(e) => handleInputChange('limites_asistente', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensaje_inicial_asistente">Mensaje inicial del asistente *</Label>
                <Textarea
                  id="mensaje_inicial_asistente"
                  placeholder="Ej: ¡Hola! Soy el asistente virtual de Farmacia XYZ. ¿En qué puedo ayudarte hoy?"
                  required
                  value={formData.mensaje_inicial_asistente}
                  onChange={(e) => handleInputChange('mensaje_inicial_asistente', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-slate-600 text-white">
              <CardTitle>Observaciones</CardTitle>
              <CardDescription className="text-slate-50">Información adicional</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones adicionales (opcional)</Label>
                <Textarea
                  id="observaciones"
                  placeholder="Cualquier información adicional que quieras compartir"
                  rows={4}
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="bg-[#47c7c0] hover:bg-[#3ab3ac] text-white px-12 py-6 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando registro...
                </>
              ) : (
                'Enviar registro'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
