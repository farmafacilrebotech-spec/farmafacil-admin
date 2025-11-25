# 📖 Guía de Uso - FarmaFácil Panel

## 🔐 1. Acceso al Sistema

### Iniciar Sesión

1. Accede a la URL del panel
2. Ingresa tu email y contraseña de administrador
3. Click en "Iniciar Sesión"

> **Nota**: Si olvidas tu contraseña, debes resetearla desde Supabase Dashboard > Authentication > Users

---

## 🏠 2. Dashboard

El dashboard muestra:

- **Total de farmacias** registradas
- **Farmacias nuevas este mes**
- **Botón de acción rápida** para crear nueva farmacia
- **Tabla con todas las farmacias** registradas

### Tabla de Farmacias

Cada fila muestra:
- **Código**: Identificador único (ej: FF00001-25)
- **Farmacia**: Nombre de la farmacia
- **Contacto**: Persona de contacto
- **Email**: Email de contacto
- **Provincia**: Ubicación
- **Fecha Alta**: Cuándo fue registrada
- **Acciones**: Botón para ver detalles

---

## ➕ 3. Crear Nueva Farmacia

### Paso 1: Acceder al Formulario

- Desde el dashboard, click en **"+ Nueva Farmacia"**
- O usa el botón de acción rápida

### Paso 2: Completar Datos Obligatorios

Los siguientes campos son **obligatorios** (marcados con *):

1. **Nombre de la Farmacia**
   - Ejemplo: "Farmacia San José"
   - Mínimo 3 caracteres

2. **Persona de Contacto**
   - Ejemplo: "Juan Pérez"
   - Nombre de la persona responsable

3. **Teléfono**
   - Ejemplo: "912345678"
   - Mínimo 9 dígitos

4. **Email**
   - Ejemplo: "contacto@farmacia.com"
   - Aquí se enviarán las credenciales
   - Debe ser válido

5. **Provincia**
   - Selecciona de la lista desplegable
   - Si no aparece, verifica que se ejecutó el SQL

### Paso 3: Datos Opcionales

Puedes completar:

- **Dirección**: Ubicación física de la farmacia
- **Instagram**: Handle (con o sin @)
- **Horario**: Horarios de atención (formato libre)
- **Color Corporativo**: Selector de color (default: #1ABBB3)
- **Logo**: Imagen (JPG, PNG, SVG - máx 5MB)
- **Mensaje de Bienvenida**: Texto personalizado para clientes
- **Observaciones**: Notas internas (no visibles para la farmacia)

### Paso 4: Subir Logo

1. Click en el botón "Seleccionar archivo"
2. Elige una imagen
3. Verás una vista previa antes de enviar

**Recomendaciones para el logo:**
- Formato PNG con fondo transparente
- Tamaño mínimo: 500x500px
- Tamaño máximo archivo: 5MB
- Aspecto cuadrado preferiblemente

### Paso 5: Crear

1. Click en **"Crear Farmacia"**
2. Espera mientras el sistema:
   - Genera el código único
   - Sube el logo
   - Crea el código QR
   - Genera credenciales seguras
   - Envía el email de bienvenida

3. Serás redirigido automáticamente a la página de la farmacia

**Tiempo estimado**: 10-30 segundos

---

## 📋 4. Ver Detalles de Farmacia

### Información Mostrada

#### Datos de Contacto
- Persona de contacto
- Teléfono
- Email
- Provincia
- Dirección (si existe)

#### Información Adicional
- Instagram (con link directo)
- Horario
- Color corporativo
- Mensaje de bienvenida
- Observaciones internas

#### Credenciales
- Usuario (email de login)
- Nota: La contraseña está encriptada y no se muestra

#### Logo
- Vista del logo subido
- Botón para descargar

#### Código QR
- Vista del QR generado
- Botón para descargar
- URL a la que apunta

### Acciones Disponibles

#### 📧 Reenviar Credenciales

- Click en **"Reenviar Credenciales"**
- Se genera una nueva contraseña
- Se envía email con las nuevas credenciales
- Úsalo si la farmacia perdió su contraseña

#### 🗑️ Eliminar Farmacia

- Click en **"Eliminar Farmacia"**
- Confirma la acción
- Se elimina permanentemente:
  - Datos de la farmacia
  - Credenciales
  - Logo del storage
  - Código QR del storage

> ⚠️ **Advertencia**: Esta acción no se puede deshacer

---

## 📧 5. Email Enviado a la Farmacia

Cuando creas una farmacia, se envía automáticamente un email que incluye:

### Contenido del Email

1. **Asunto**: "¡Bienvenido a FarmaFácil! - [Nombre Farmacia]"

2. **Información incluida**:
   - Código de Farmacia (ej: FF00001-25)
   - Usuario (email)
   - Contraseña generada automáticamente
   - Link al panel de farmacias
   - Código QR adjunto
   - Instrucciones de uso

3. **Diseño**:
   - Profesional y responsive
   - Colores corporativos de FarmaFácil
   - Compatible con todos los clientes de email

### Qué Hacer si el Email No Llega

1. Verifica que el email esté bien escrito
2. Revisa la carpeta de SPAM
3. Verifica tu API key de Resend
4. Usa el botón "Reenviar Credenciales" desde el panel

---

## 🎨 6. Sistema de Códigos

### Formato del Código

```
FF00001-25
││ ││││ ││
││ ││││ │└─ Año (últimos 2 dígitos)
││ ││││ └── Separador
││ ││└───── Número secuencial (5 dígitos)
│└─┴─────── Prefijo "FarmaFácil"
```

### Características

- **Único**: Nunca se repite
- **Secuencial**: Incrementa automáticamente
- **Por año**: Reinicia cada año (opcional)
- **Ejemplo**: 
  - Primera farmacia 2025: FF00001-25
  - Segunda farmacia 2025: FF00002-25
  - Primera farmacia 2026: FF00001-26

---

## 🔒 7. Seguridad

### Contraseñas

- Se generan automáticamente (16 caracteres)
- Combinación de letras, números y mayúsculas
- Se almacenan hasheadas con bcrypt
- Nunca se muestran en texto plano
- Al reenviar credenciales, se genera una nueva

### Acceso al Panel

- Solo usuarios autenticados pueden acceder
- Sin sesión → Redirige a login
- Con sesión en login → Redirige a dashboard
- Token de sesión en cookies

### Storage

- Logos y QRs en buckets públicos de Supabase
- URLs públicas pero no indexables
- Subida solo desde el servidor

---

## 📊 8. Reportes y Estadísticas

### Dashboard

- Total de farmacias
- Nuevas este mes
- Listado completo ordenado por fecha

### Información Adicional

Para estadísticas más avanzadas, consulta:
- Supabase Dashboard > Database > Tables
- Función SQL: `get_farmacias_stats()`

---

## 🛠️ 9. Mantenimiento

### Tareas Regulares

- **Diario**: Revisar emails no entregados
- **Semanal**: Verificar storage de Supabase
- **Mensual**: Backup de base de datos

### Backup

Desde Supabase:
1. Database > Backups
2. Download backup
3. Guarda en lugar seguro

---

## 📞 10. Soporte y Ayuda

### Problemas Comunes

#### "No puedo iniciar sesión"
- Verifica email y contraseña
- Asegúrate de ser usuario administrador
- Verifica conexión a Supabase

#### "El email no se envía"
- Verifica API key de Resend
- Revisa logs en Resend Dashboard
- La farmacia se crea igual, reenvía después

#### "Error al subir logo"
- Verifica tamaño (máx 5MB)
- Verifica formato (JPG, PNG, SVG)
- Verifica buckets en Supabase Storage

#### "Código duplicado"
- Esto no debería pasar
- Verifica tabla `farmacia_codigo_autonumerico`
- Contacta soporte técnico

### Logs y Debugging

- Abre la consola del navegador (F12)
- Revisa la pestaña Console
- Busca mensajes de error en rojo
- Comparte el error completo con soporte

---

## 🎯 11. Mejores Prácticas

### Al Crear Farmacias

✅ **Haz esto**:
- Verifica que el email sea correcto
- Sube un logo de calidad
- Completa todos los datos posibles
- Verifica que llegue el email

❌ **Evita esto**:
- Crear farmacias de prueba en producción
- Usar emails incorrectos
- Duplicar farmacias sin eliminar la anterior
- Subir logos de baja calidad

### Gestión de Credenciales

- No compartas las credenciales por canales inseguros
- Usa el email automático
- Si necesitas reenviar, usa el botón del panel
- Informa a la farmacia cada vez que cambies la contraseña

### Mantenimiento del Storage

- Antes de eliminar una farmacia, verifica que no esté en uso
- Los archivos huérfanos ocupan espacio
- Limpia periódicamente el storage

---

## 📱 12. Flujo Completo Recomendado

### Proceso Ideal

1. **Preparación**
   - Recibe solicitud de la farmacia
   - Verifica documentación
   - Prepara logo de la farmacia

2. **Registro**
   - Accede al panel
   - Click en "Nueva Farmacia"
   - Completa datos obligatorios
   - Completa datos opcionales
   - Sube logo
   - Click en "Crear Farmacia"

3. **Verificación**
   - Verifica que se creó correctamente
   - Descarga el QR
   - Verifica que llegó el email

4. **Entrega**
   - Confirma con la farmacia que recibió el email
   - Instrúyeles sobre cómo usar sus credenciales
   - Envía el QR impreso o digital
   - Responde dudas

5. **Seguimiento**
   - Verifica que puedan acceder
   - Asiste en configuración inicial
   - Documenta cualquier incidencia

---

**¿Necesitas ayuda? Revisa el README.md y SETUP.md para más información técnica.**

