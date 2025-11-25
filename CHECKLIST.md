# ✅ CHECKLIST DE CONFIGURACIÓN - FarmaFácil

## 📋 Lista de Verificación Completa

### 🔧 1. SETUP INICIAL

#### Repositorio
- [ ] Proyecto clonado/descargado
- [ ] Navegado a la carpeta del proyecto
- [ ] Dependencias instaladas (`npm install`)

#### Variables de Entorno
- [ ] Archivo `.env.local` creado en la raíz
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurada
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurada
- [ ] `SUPABASE_SERVICE_KEY` configurada
- [ ] `RESEND_API_KEY` configurada
- [ ] `EMAIL_FROM` configurada
- [ ] `NEXT_PUBLIC_FARMACIA_PANEL_URL` configurada
- [ ] `NEXT_PUBLIC_CLIENTE_URL` configurada

---

### 🗄️ 2. SUPABASE

#### Proyecto
- [ ] Cuenta de Supabase creada
- [ ] Proyecto de Supabase creado
- [ ] API keys copiadas del dashboard

#### Base de Datos
- [ ] SQL Editor abierto
- [ ] Contenido de `database/schema.sql` copiado
- [ ] SQL ejecutado exitosamente
- [ ] Tabla `provincias` tiene 52 registros
- [ ] Tabla `farmacias` existe
- [ ] Tabla `farmacias_credenciales` existe
- [ ] Tabla `farmacia_codigo_autonumerico` existe

#### Storage
- [ ] Bucket `farmacias-logos` creado
- [ ] Bucket `farmacias-logos` es público
- [ ] Bucket `farmacias-qr` creado
- [ ] Bucket `farmacias-qr` es público

#### Authentication
- [ ] Email provider habilitado
- [ ] Usuario administrador creado
- [ ] Email y contraseña anotados

---

### 📧 3. RESEND (Email)

#### Cuenta
- [ ] Cuenta de Resend creada (gratis)
- [ ] API Key generada
- [ ] API Key copiada a `.env.local`

#### Dominio (Opcional)
- [ ] Dominio añadido (opcional)
- [ ] Registros DNS configurados (opcional)
- [ ] `EMAIL_FROM` actualizado con dominio (opcional)

---

### 💻 4. DESARROLLO

#### Instalación
- [ ] Node.js 18+ instalado
- [ ] npm funcionando correctamente
- [ ] `npm install` ejecutado sin errores

#### Ejecución
- [ ] `npm run dev` ejecutado
- [ ] Proyecto corre en `http://localhost:3000`
- [ ] No hay errores en consola
- [ ] No hay errores de TypeScript

---

### 🔐 5. PRUEBA DE FUNCIONALIDAD

#### Login
- [ ] Página de login carga correctamente
- [ ] Puedo iniciar sesión con mis credenciales
- [ ] Redirige a dashboard tras login
- [ ] No puedo acceder a rutas sin estar logueado

#### Dashboard
- [ ] Dashboard carga correctamente
- [ ] Se ven las estadísticas
- [ ] Botón "Nueva Farmacia" funciona
- [ ] Tabla de farmacias se muestra
- [ ] Botón "Cerrar Sesión" funciona

#### Crear Farmacia
- [ ] Formulario de nueva farmacia carga
- [ ] Puedo completar campos obligatorios
- [ ] Selector de provincia funciona
- [ ] Color picker funciona
- [ ] Puedo subir un logo
- [ ] Preview del logo se muestra
- [ ] Click en "Crear Farmacia" funciona
- [ ] Se muestra loading state
- [ ] Redirige a página de detalle
- [ ] Se muestra notificación de éxito

#### Detalle de Farmacia
- [ ] Página de detalle carga correctamente
- [ ] Todos los datos se muestran
- [ ] Logo se ve correctamente
- [ ] QR se ve correctamente
- [ ] Botón de descargar logo funciona
- [ ] Botón de descargar QR funciona
- [ ] Botón "Reenviar Credenciales" funciona
- [ ] Botón "Eliminar Farmacia" funciona

#### Email
- [ ] Email de bienvenida llegó
- [ ] Email tiene el diseño correcto
- [ ] Credenciales están en el email
- [ ] QR está incluido en el email
- [ ] Links funcionan en el email

---

### 🎨 6. VERIFICACIÓN VISUAL

#### Diseño
- [ ] Colores corporativos se ven bien
- [ ] Fuentes cargan correctamente
- [ ] Iconos se muestran
- [ ] Diseño es responsive (móvil)
- [ ] No hay elementos rotos

#### UX
- [ ] Botones responden al hover
- [ ] Loading states se muestran
- [ ] Notificaciones (toasts) aparecen
- [ ] Formularios validan correctamente
- [ ] Mensajes de error son claros

---

### 🚀 7. PREPARACIÓN PARA PRODUCCIÓN

#### Código
- [ ] `npm run build` ejecuta sin errores
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run lint` pasa sin errores críticos
- [ ] Archivo `.gitignore` está correcto

#### Deployment
- [ ] Plataforma elegida (Vercel/Netlify/Railway)
- [ ] Repositorio conectado
- [ ] Variables de entorno configuradas en la plataforma
- [ ] Build settings configurados
- [ ] Deploy exitoso
- [ ] URL de producción funciona

#### Post-Deploy
- [ ] Login funciona en producción
- [ ] Crear farmacia funciona en producción
- [ ] Emails se envían en producción
- [ ] Archivos se suben correctamente
- [ ] QR se genera correctamente

---

### 📱 8. PRUEBA COMPLETA

#### Flujo End-to-End
- [ ] Login exitoso
- [ ] Dashboard carga con datos
- [ ] Nueva farmacia se crea
- [ ] Código generado es correcto (formato FF00001-25)
- [ ] Logo se sube y se ve
- [ ] QR se genera y se ve
- [ ] Email llega con toda la información
- [ ] Detalle de farmacia muestra todo
- [ ] Reenviar credenciales funciona
- [ ] Nuevo email llega con nueva contraseña
- [ ] Eliminar farmacia funciona
- [ ] Farmacia se elimina de la lista

---

### 📚 9. DOCUMENTACIÓN

#### Revisada
- [ ] README.md leído
- [ ] SETUP.md revisado
- [ ] USAGE.md entendido
- [ ] PROYECTO_COMPLETO.md revisado
- [ ] database/schema.sql entendido

#### Entendimiento
- [ ] Sé cómo crear una farmacia
- [ ] Sé cómo reenviar credenciales
- [ ] Sé cómo eliminar una farmacia
- [ ] Sé dónde están los logs
- [ ] Sé cómo hacer backup

---

### 🛡️ 10. SEGURIDAD

#### Credenciales
- [ ] `.env.local` no está en git
- [ ] `.env.local` no se compartió públicamente
- [ ] Service Key de Supabase está segura
- [ ] Resend API Key está segura
- [ ] Usuario admin tiene contraseña fuerte

#### Permisos
- [ ] RLS está habilitado en Supabase
- [ ] Buckets de storage son públicos (intencional)
- [ ] Solo admin puede acceder al panel
- [ ] Middleware protege rutas correctamente

---

## 🎯 ESTADO FINAL

### ✅ TODO COMPLETADO
Marca todos los checkboxes y tu sistema estará 100% funcional.

### ⚠️ SI ALGO FALLA
1. Revisa el checkbox específico
2. Consulta la documentación correspondiente
3. Revisa los logs de la consola
4. Verifica las variables de entorno

### 🆘 PROBLEMAS COMUNES

#### No carga nada
→ Verifica que `npm run dev` esté corriendo

#### Error de Supabase
→ Verifica las keys en `.env.local`

#### Email no llega
→ Verifica `RESEND_API_KEY` y revisa Resend Dashboard

#### No puedo subir archivos
→ Verifica que los buckets existan y sean públicos

#### Error 401
→ Verifica `SUPABASE_SERVICE_KEY`

---

## 🎊 ¡FELICIDADES!

Si todos los checks están marcados, tu sistema está **100% funcional** y listo para:

- ✅ Crear farmacias
- ✅ Gestionar credenciales
- ✅ Enviar emails
- ✅ Generar QRs
- ✅ ¡Y mucho más!

---

**¿Necesitas ayuda?**
- Consulta README.md para info técnica
- Consulta SETUP.md para configuración
- Consulta USAGE.md para uso diario
- Consulta PROYECTO_COMPLETO.md para overview completo

---

*Creado para FarmaFácil - Noviembre 2025*

