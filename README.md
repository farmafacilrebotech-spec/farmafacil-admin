# FarmaFácil - Panel de Alta de Farmacias

Panel de administración para gestionar el alta de farmacias en el sistema FarmaFácil. Permite crear farmacias, generar códigos únicos, subir logos, crear códigos QR y enviar credenciales automáticamente por email.

## 🚀 Características

- ✅ Autenticación segura con Supabase Auth
- ✅ Generación automática de códigos de farmacia (formato: FF00001-25)
- ✅ Subida de logos a Supabase Storage
- ✅ Generación automática de códigos QR
- ✅ Creación de credenciales con hash bcrypt
- ✅ Envío automático de emails de bienvenida
- ✅ Dashboard con listado de farmacias
- ✅ Vista detallada de cada farmacia
- ✅ Reenvío de credenciales
- ✅ Eliminación de farmacias

## 🛠️ Tecnologías

- **Next.js 14** con App Router
- **TypeScript**
- **TailwindCSS** para estilos
- **Shadcn/ui** para componentes
- **Supabase** para base de datos, autenticación y storage
- **bcryptjs** para hash de contraseñas
- **qrcode** para generación de códigos QR
- **Resend** para envío de emails
- **React Hook Form + Zod** para validación de formularios

## 📋 Requisitos Previos

- Node.js 18+
- Una cuenta en Supabase
- Una cuenta en Resend (para emails)
- npm o yarn

## 🔧 Configuración

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd FarmaFacil_Formulario_Alta
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_KEY=tu_supabase_service_key

# Email (Resend)
RESEND_API_KEY=tu_resend_api_key
EMAIL_FROM=noreply@farmafacil.com

# URLs
NEXT_PUBLIC_FARMACIA_PANEL_URL=https://farmafacil-farmacias.netlify.app
NEXT_PUBLIC_CLIENTE_URL=https://farmafacil-clientes.netlify.app
```

### 4. Configurar Supabase

#### A. Crear las tablas

Ejecuta el siguiente SQL en el editor SQL de Supabase:

```sql
-- Ver archivo database/schema.sql
```

Consulta el archivo `database/schema.sql` para el script completo.

#### B. Crear los buckets de Storage

1. Ve a **Storage** en tu dashboard de Supabase
2. Crea dos buckets públicos:
   - `farmacias-logos`
   - `farmacias-qr`
3. Configura ambos buckets como públicos

#### C. Configurar Autenticación

1. Ve a **Authentication** > **Providers**
2. Habilita **Email** provider
3. Crea tu usuario administrador desde **Authentication** > **Users**

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
/
├── app/
│   ├── api/
│   │   └── farmacias/
│   │       ├── crear/route.ts          # API para crear farmacia
│   │       ├── reenviar-credenciales/route.ts
│   │       └── eliminar/route.ts
│   ├── dashboard/page.tsx              # Dashboard principal
│   ├── login/page.tsx                  # Página de login
│   ├── farmacias/
│   │   ├── nueva/page.tsx              # Formulario nueva farmacia
│   │   └── [id]/page.tsx               # Detalle de farmacia
│   ├── layout.tsx                      # Layout principal
│   └── globals.css                     # Estilos globales
├── components/
│   ├── ui/                             # Componentes Shadcn/ui
│   ├── forms/
│   │   └── FarmaciaForm.tsx           # Formulario de farmacia
│   ├── FarmaciasTable.tsx             # Tabla de farmacias
│   ├── LogoutButton.tsx
│   ├── ReenviarCredencialesButton.tsx
│   └── EliminarFarmaciaButton.tsx
├── lib/
│   ├── supabaseClient.ts              # Cliente Supabase
│   ├── farmaciaIdGenerator.ts         # Generador de códigos
│   ├── qr.ts                          # Generación de QR
│   ├── email.ts                       # Envío de emails
│   └── utils.ts                       # Utilidades
├── database/
│   └── schema.sql                     # Schema de base de datos
└── middleware.ts                       # Middleware de autenticación
```

## 🎨 Colores de Marca

- **Principal**: #1ABBB3
- **Secundario**: #4ED3C2
- **Blanco**: #FFFFFF
- **Gris oscuro**: #333333

## 📊 Base de Datos

### Tablas Principales

1. **farmacias** - Datos de las farmacias
2. **provincias** - Catálogo de provincias
3. **farmacias_credenciales** - Credenciales de acceso
4. **farmacia_codigo_autonumerico** - Control de códigos

Ver `database/schema.sql` para el esquema completo.

## 🔐 Seguridad

- Las contraseñas se almacenan hasheadas con bcrypt
- Las rutas están protegidas con middleware de autenticación
- Se usa Supabase Service Role Key solo en el servidor
- Los archivos se suben a buckets públicos de Supabase Storage

## 📧 Emails

Los emails se envían usando Resend. Incluyen:
- Credenciales de acceso
- Código QR adjunto
- Instrucciones de uso
- Diseño responsive y profesional

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno
3. Despliega

### Netlify

1. Conecta tu repositorio con Netlify
2. Configura las variables de entorno
3. Build command: `npm run build`
4. Publish directory: `.next`

## 📝 Uso

1. **Login**: Accede con tu email y contraseña de administrador
2. **Dashboard**: Visualiza todas las farmacias registradas
3. **Nueva Farmacia**: Completa el formulario con los datos
4. **Creación**: El sistema automáticamente:
   - Genera el código de farmacia
   - Sube el logo
   - Crea el QR
   - Guarda las credenciales
   - Envía el email de bienvenida
5. **Gestión**: Visualiza detalles, reenvía credenciales o elimina farmacias

## 🐛 Troubleshooting

### El email no se envía

- Verifica que `RESEND_API_KEY` esté configurada correctamente
- Revisa los logs en Resend Dashboard
- El sistema continúa funcionando aunque el email falle

### Error al subir imágenes

- Verifica que los buckets de Storage estén creados
- Asegúrate de que sean públicos
- Verifica los permisos en Supabase

### Error de autenticación

- Verifica las credenciales en Supabase
- Asegúrate de que el usuario existe en Authentication
- Revisa las variables de entorno

## 📄 Licencia

Privado - Todos los derechos reservados

## 👨‍💻 Autor

FarmaFácil Team

