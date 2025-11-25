# 🔐 Configuración de Autenticación - FarmaFácil Admin Panel

## 📋 Pasos para Configurar Auth

### 1. Ejecutar SQL en Supabase

1. Ve a tu proyecto en Supabase
2. Ve a **SQL Editor**
3. Ejecuta el contenido de `database/admins_table.sql`
4. Verifica que la tabla `admins` se haya creado

### 2. Crear tu Primer Usuario Admin

#### A. Crear Usuario en Supabase Auth

1. Ve a **Authentication** > **Users** en Supabase Dashboard
2. Click en **Add user**
3. Selecciona **Create new user**
4. Ingresa:
   - Email: tu-email@example.com
   - Password: tu-contraseña-segura
   - **Importante**: Marca "Auto Confirm User"
5. Click en **Create user**
6. **Copia el UUID del usuario** (lo necesitarás en el siguiente paso)

#### B. Agregar Usuario a la Tabla Admins

1. Ve a **SQL Editor**
2. Ejecuta el siguiente SQL (reemplaza los valores):

```sql
INSERT INTO public.admins (id, email, role)
VALUES (
    'uuid-del-usuario-que-copiaste',  -- UUID de Authentication > Users
    'tu-email@example.com',            -- El mismo email
    'superadmin'                       -- O 'admin' o 'restringido'
);
```

### 3. Configurar Variables de Entorno

Asegúrate de que tu `.env.local` tenga:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_KEY=tu_service_key
```

### 4. Instalar Dependencias

```bash
npm install
```

### 5. Probar el Login

```bash
npm run dev
```

1. Abre http://localhost:3000
2. Serás redirigido a /login
3. Ingresa el email y contraseña que creaste
4. Deberías ser redirigido a /dashboard

## 🎯 Roles de Admin

### superadmin
- Acceso completo a todo
- Puede gestionar otros admins
- Puede ver, crear, editar y eliminar farmacias

### admin
- Puede gestionar farmacias
- No puede gestionar otros admins

### restringido
- Solo puede ver farmacias
- No puede crear, editar o eliminar

## 🔒 Rutas Protegidas

El middleware protege automáticamente:
- `/dashboard` y todas sus subrutas
- `/farmacias/**` (todas las rutas de farmacias)

Si intentas acceder sin sesión, serás redirigido a `/login`.

## 🛡️ Row Level Security (RLS)

La tabla `admins` tiene RLS habilitado con las siguientes políticas:

1. **Los admins pueden verse a sí mismos**
   - Cualquier admin puede hacer SELECT de su propio registro

2. **Los superadmins pueden ver todos los admins**
   - Solo los superadmins pueden hacer SELECT de todos los registros

3. **Solo superadmins pueden gestionar admins**
   - Solo superadmins pueden INSERT, UPDATE, DELETE en la tabla

## 🔧 Troubleshooting

### Error: "Invalid login credentials"
- Verifica que el email y contraseña sean correctos
- Verifica que el usuario esté confirmado en Authentication
- Verifica que el usuario exista en la tabla `admins`

### Error: "Not authorized"
- Verifica que el usuario esté en la tabla `admins`
- Verifica que el UUID en `admins.id` coincida con el de `auth.users`
- Ejecuta este SQL para verificar:

```sql
SELECT 
    a.id,
    a.email,
    a.role,
    u.email as auth_email
FROM public.admins a
LEFT JOIN auth.users u ON u.id = a.id;
```

### Me redirige a /login aunque esté logueado
- Limpia las cookies del navegador
- Verifica que el middleware esté funcionando
- Verifica que la tabla `admins` tenga tu usuario

### No puedo acceder a /dashboard
- Verifica que estés logueado
- Verifica que tu usuario esté en la tabla `admins`
- Revisa la consola del navegador y del servidor para errores

## 📝 Crear Más Admins

Para crear más usuarios admin:

1. Crea el usuario en **Authentication** > **Users**
2. Copia su UUID
3. Ejecuta el INSERT en la tabla admins:

```sql
INSERT INTO public.admins (id, email, role)
VALUES ('uuid-nuevo', 'email@example.com', 'admin');
```

## 🚀 Próximos Pasos

Una vez que el login funciona:

1. ✅ Puedes acceder a `/login`
2. ✅ Puedes iniciar sesión
3. ✅ Eres redirigido a `/dashboard`
4. ✅ Las rutas están protegidas
5. ✅ Puedes cerrar sesión

**¡Tu panel de admin está protegido y listo para usar!** 🎉

