# 🚀 Configuración Rápida - FarmaFácil Panel

## ⚡ Inicio Rápido (5 minutos)

### 1. Variables de Entorno

Crea `.env.local` con:

```env
# Supabase - Obtén estas claves de tu dashboard de Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_KEY=tu_service_role_key_aqui

# Resend - Obtén tu API key en https://resend.com
RESEND_API_KEY=re_tu_api_key_aqui
EMAIL_FROM=noreply@farmafacil.com

# URLs de producción (ajusta según tu despliegue)
NEXT_PUBLIC_FARMACIA_PANEL_URL=https://farmafacil-farmacias.netlify.app
NEXT_PUBLIC_CLIENTE_URL=https://farmafacil-clientes.netlify.app
```

### 2. Configurar Supabase

#### A. Ejecutar SQL

1. Ve a tu proyecto en Supabase
2. Click en **SQL Editor**
3. Copia y pega el contenido de `database/schema.sql`
4. Click en **Run**

#### B. Crear Buckets de Storage

1. Ve a **Storage** en Supabase
2. Click en **New bucket**
3. Crea estos dos buckets como **PÚBLICOS**:
   - `farmacias-logos`
   - `farmacias-qr`

Para hacerlos públicos:
- Click en el bucket
- Click en **Settings**
- Marca **Public bucket**
- Click en **Save**

#### C. Crear Usuario Administrador

1. Ve a **Authentication** > **Users**
2. Click en **Add user**
3. Ingresa tu email y contraseña
4. Click en **Create user**

Este será tu usuario para acceder al panel.

### 3. Instalar y Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 4. Primera Prueba

1. Accede con el email y contraseña que creaste
2. Click en **+ Nueva Farmacia**
3. Completa el formulario
4. ¡Listo! El sistema automáticamente:
   - Genera el código (FF00001-25)
   - Sube el logo
   - Crea el QR
   - Genera credenciales
   - Envía el email

## 📋 Checklist de Configuración

- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Script SQL ejecutado en Supabase
- [ ] Buckets de Storage creados y públicos
- [ ] Usuario administrador creado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Proyecto corriendo (`npm run dev`)
- [ ] Login exitoso
- [ ] Primera farmacia creada

## 🔑 Obtener Claves de Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Abre tu proyecto
3. Ve a **Settings** > **API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_KEY` (¡Mantén esto secreto!)

## 📧 Configurar Resend

1. Ve a [https://resend.com](https://resend.com)
2. Crea una cuenta
3. Ve a **API Keys**
4. Click en **Create API Key**
5. Copia la key → `RESEND_API_KEY`

### Configurar Dominio (Opcional pero recomendado)

1. En Resend, ve a **Domains**
2. Añade tu dominio
3. Configura los registros DNS
4. Actualiza `EMAIL_FROM` con tu email

## 🐛 Solución de Problemas Comunes

### Error: "Invalid API key"
- Verifica que las claves de Supabase sean correctas
- Asegúrate de tener `.env.local` (no `.env`)
- Reinicia el servidor (`Ctrl+C` y luego `npm run dev`)

### Error: "Failed to fetch"
- Verifica la URL de Supabase
- Asegúrate de que no tenga `/` al final

### Email no se envía
- Verifica tu API key de Resend
- El sistema funcionará igual, solo no enviará el email
- Puedes usar el botón "Reenviar Credenciales" después

### No puedo subir imágenes
- Verifica que los buckets existan
- Asegúrate de que sean públicos
- Verifica los nombres: `farmacias-logos` y `farmacias-qr`

### Error 401 al crear farmacia
- Verifica que `SUPABASE_SERVICE_KEY` esté configurada
- Asegúrate de tener permisos de service_role

## 📱 Próximos Pasos

Una vez que el panel funciona:

1. **Despliega en Vercel/Netlify**
   - Configura las variables de entorno
   - Conecta tu repositorio
   - Despliega

2. **Configura el dominio**
   - Añade tu dominio personalizado
   - Actualiza las URLs en `.env.local`

3. **Prueba el flujo completo**
   - Crea una farmacia de prueba
   - Verifica que llegue el email
   - Descarga el QR
   - Prueba las credenciales

## 🎨 Personalización

### Cambiar Colores

Edita `app/globals.css`:

```css
:root {
  --farmafacil-primary: 176 63% 41%; /* Tu color principal */
  --farmafacil-secondary: 174 65% 60%; /* Tu color secundario */
}
```

### Cambiar Logo

Reemplaza el círculo con "FF" en:
- `app/login/page.tsx`
- `app/dashboard/page.tsx`

### Personalizar Emails

Edita la plantilla en `lib/email.ts`

## 📞 Soporte

Si tienes problemas:

1. Verifica el checklist de configuración
2. Revisa los logs en la consola
3. Revisa la documentación de [Supabase](https://supabase.com/docs)
4. Revisa la documentación de [Resend](https://resend.com/docs)

---

**¡Listo para empezar a gestionar farmacias! 🎉**

