-- =====================================================
-- TABLA DE ADMINISTRADORES
-- =====================================================

-- Crear la tabla admins
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('superadmin', 'admin', 'restringido')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Política: Los admins pueden verse a sí mismos
CREATE POLICY "Admins can view themselves" ON public.admins
    FOR SELECT
    USING (auth.uid() = id);

-- Política: Los superadmins pueden ver todos los admins
CREATE POLICY "Superadmins can view all admins" ON public.admins
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE id = auth.uid() AND role = 'superadmin'
        )
    );

-- Política: Los superadmins pueden insertar admins
CREATE POLICY "Superadmins can insert admins" ON public.admins
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE id = auth.uid() AND role = 'superadmin'
        )
    );

-- Política: Los superadmins pueden actualizar admins
CREATE POLICY "Superadmins can update admins" ON public.admins
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE id = auth.uid() AND role = 'superadmin'
        )
    );

-- Política: Los superadmins pueden eliminar admins
CREATE POLICY "Superadmins can delete admins" ON public.admins
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE id = auth.uid() AND role = 'superadmin'
        )
    );

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON public.admins(role);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_admins_updated_at 
    BEFORE UPDATE ON public.admins 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE public.admins IS 'Tabla de administradores del panel FarmaFácil';
COMMENT ON COLUMN public.admins.role IS 'Rol del admin: superadmin, admin, o restringido';

-- =====================================================
-- DATOS DE EJEMPLO (Opcional - crear tu primer admin)
-- =====================================================

-- IMPORTANTE: Después de crear un usuario en Supabase Auth Dashboard,
-- inserta su información aquí reemplazando los valores:
--
-- INSERT INTO public.admins (id, email, role)
-- VALUES (
--     'uuid-del-usuario-en-auth',  -- Obtén esto de Authentication > Users
--     'tu-email@example.com',
--     'superadmin'
-- );

