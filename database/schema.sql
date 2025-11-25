-- =====================================================
-- FARMAFÁCIL - SCHEMA DE BASE DE DATOS
-- Panel de Alta de Farmacias
-- =====================================================

-- Tabla: provincias
-- Catálogo de provincias de España
CREATE TABLE IF NOT EXISTS public.provincias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar provincias de España
INSERT INTO public.provincias (nombre) VALUES
('Álava'), ('Albacete'), ('Alicante'), ('Almería'), ('Asturias'),
('Ávila'), ('Badajoz'), ('Baleares'), ('Barcelona'), ('Burgos'),
('Cáceres'), ('Cádiz'), ('Cantabria'), ('Castellón'), ('Ceuta'),
('Ciudad Real'), ('Córdoba'), ('Cuenca'), ('Girona'), ('Granada'),
('Guadalajara'), ('Guipúzcoa'), ('Huelva'), ('Huesca'), ('Jaén'),
('La Coruña'), ('La Rioja'), ('Las Palmas'), ('León'), ('Lérida'),
('Lugo'), ('Madrid'), ('Málaga'), ('Melilla'), ('Murcia'),
('Navarra'), ('Ourense'), ('Palencia'), ('Pontevedra'), ('Salamanca'),
('Santa Cruz de Tenerife'), ('Segovia'), ('Sevilla'), ('Soria'), ('Tarragona'),
('Teruel'), ('Toledo'), ('Valencia'), ('Valladolid'), ('Vizcaya'),
('Zamora'), ('Zaragoza')
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================
-- Tabla: farmacia_codigo_autonumerico
-- Control de códigos autonuméricos por año
-- =====================================================
CREATE TABLE IF NOT EXISTS public.farmacia_codigo_autonumerico (
    id SERIAL PRIMARY KEY,
    anio INTEGER NOT NULL UNIQUE,
    ultimo_numero INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas rápidas por año
CREATE INDEX IF NOT EXISTS idx_codigo_autonumerico_anio 
ON public.farmacia_codigo_autonumerico(anio);

-- =====================================================
-- Tabla: farmacias
-- Datos principales de las farmacias
-- =====================================================
CREATE TABLE IF NOT EXISTS public.farmacias (
    id SERIAL PRIMARY KEY,
    farmacia_id VARCHAR(20) NOT NULL UNIQUE, -- Formato: FF00001-25
    nombre_farmacia VARCHAR(200) NOT NULL,
    persona_contacto VARCHAR(200) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(200) NOT NULL,
    provincia_id INTEGER REFERENCES public.provincias(id) ON DELETE SET NULL,
    
    -- Campos opcionales
    direccion TEXT,
    instagram VARCHAR(100),
    horario TEXT,
    color VARCHAR(7) DEFAULT '#1ABBB3', -- Color en formato hexadecimal
    logo_url TEXT,
    qr_url TEXT,
    mensaje_bienvenida TEXT,
    observaciones TEXT,
    
    -- Campos de auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_farmacias_farmacia_id 
ON public.farmacias(farmacia_id);

CREATE INDEX IF NOT EXISTS idx_farmacias_email 
ON public.farmacias(email);

CREATE INDEX IF NOT EXISTS idx_farmacias_provincia_id 
ON public.farmacias(provincia_id);

CREATE INDEX IF NOT EXISTS idx_farmacias_created_at 
ON public.farmacias(created_at DESC);

-- =====================================================
-- Tabla: farmacias_credenciales
-- Credenciales de acceso de las farmacias
-- =====================================================
CREATE TABLE IF NOT EXISTS public.farmacias_credenciales (
    id SERIAL PRIMARY KEY,
    farmacia_id VARCHAR(20) NOT NULL UNIQUE REFERENCES public.farmacias(farmacia_id) ON DELETE CASCADE,
    email_login VARCHAR(200) NOT NULL,
    password_hash TEXT NOT NULL, -- Hash bcrypt
    
    -- Campos de auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_credenciales_farmacia_id 
ON public.farmacias_credenciales(farmacia_id);

CREATE INDEX IF NOT EXISTS idx_credenciales_email_login 
ON public.farmacias_credenciales(email_login);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para actualizar updated_at en farmacias
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_farmacias_updated_at BEFORE UPDATE
    ON public.farmacias FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credenciales_updated_at BEFORE UPDATE
    ON public.farmacias_credenciales FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_codigo_autonumerico_updated_at BEFORE UPDATE
    ON public.farmacia_codigo_autonumerico FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en las tablas
ALTER TABLE public.provincias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmacias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmacias_credenciales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmacia_codigo_autonumerico ENABLE ROW LEVEL SECURITY;

-- Políticas para provincias (solo lectura pública)
CREATE POLICY "Provincias son públicas" ON public.provincias
    FOR SELECT USING (true);

-- Políticas para farmacias (acceso completo para service_role)
CREATE POLICY "Service role tiene acceso completo a farmacias" ON public.farmacias
    USING (auth.role() = 'service_role');

-- Políticas para credenciales (solo service_role)
CREATE POLICY "Service role tiene acceso completo a credenciales" ON public.farmacias_credenciales
    USING (auth.role() = 'service_role');

-- Políticas para código autonumérico (solo service_role)
CREATE POLICY "Service role tiene acceso completo a autonumérico" ON public.farmacia_codigo_autonumerico
    USING (auth.role() = 'service_role');

-- =====================================================
-- BUCKETS DE STORAGE
-- =====================================================

-- IMPORTANTE: Estos buckets deben crearse manualmente en Supabase Dashboard
-- 1. Ve a Storage en tu dashboard de Supabase
-- 2. Crea estos buckets como PÚBLICOS:
--    - farmacias-logos
--    - farmacias-qr
-- 3. Configura las políticas de acceso como públicas

-- Política de storage para farmacias-logos
-- INSERT INTO storage.policies (name, bucket_id, definition)
-- VALUES (
--   'Public Access',
--   'farmacias-logos',
--   'SELECT true'
-- );

-- Política de storage para farmacias-qr
-- INSERT INTO storage.policies (name, bucket_id, definition)
-- VALUES (
--   'Public Access',
--   'farmacias-qr',
--   'SELECT true'
-- );

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista completa de farmacias con información relacionada
CREATE OR REPLACE VIEW public.farmacias_completas AS
SELECT 
    f.*,
    p.nombre as provincia_nombre,
    fc.email_login,
    fc.created_at as credenciales_created_at
FROM public.farmacias f
LEFT JOIN public.provincias p ON f.provincia_id = p.id
LEFT JOIN public.farmacias_credenciales fc ON f.farmacia_id = fc.farmacia_id;

-- =====================================================
-- FUNCIONES AUXILIARES
-- =====================================================

-- Función para obtener estadísticas
CREATE OR REPLACE FUNCTION public.get_farmacias_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total', COUNT(*),
        'this_month', COUNT(*) FILTER (
            WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())
        ),
        'this_year', COUNT(*) FILTER (
            WHERE DATE_TRUNC('year', created_at) = DATE_TRUNC('year', NOW())
        ),
        'by_province', (
            SELECT json_object_agg(p.nombre, COUNT(f.id))
            FROM public.farmacias f
            JOIN public.provincias p ON f.provincia_id = p.id
            GROUP BY p.nombre
        )
    ) INTO result
    FROM public.farmacias;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DATOS DE PRUEBA (OPCIONAL - COMENTAR EN PRODUCCIÓN)
-- =====================================================

-- Descomentar solo para desarrollo/pruebas

-- INSERT INTO public.farmacia_codigo_autonumerico (anio, ultimo_numero)
-- VALUES (2025, 0);

-- =====================================================
-- COMENTARIOS
-- =====================================================

COMMENT ON TABLE public.provincias IS 'Catálogo de provincias de España';
COMMENT ON TABLE public.farmacias IS 'Datos principales de las farmacias registradas';
COMMENT ON TABLE public.farmacias_credenciales IS 'Credenciales de acceso para el panel de farmacias';
COMMENT ON TABLE public.farmacia_codigo_autonumerico IS 'Control de códigos autonuméricos por año';

COMMENT ON COLUMN public.farmacias.farmacia_id IS 'Código único de farmacia (formato: FF00001-25)';
COMMENT ON COLUMN public.farmacias.color IS 'Color corporativo en formato hexadecimal (#1ABBB3)';
COMMENT ON COLUMN public.farmacias.logo_url IS 'URL pública del logo en Supabase Storage';
COMMENT ON COLUMN public.farmacias.qr_url IS 'URL pública del código QR en Supabase Storage';

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

