import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallback for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

// Cliente público (anon key)
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Cliente de servidor (service role) para operaciones administrativas
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Tipos para las tablas
export interface Farmacia {
  id?: number;
  farmacia_id: string;
  nombre_farmacia: string;
  persona_contacto: string;
  telefono: string;
  email: string;
  provincia_id?: number;
  direccion?: string;
  instagram?: string;
  horario?: string;
  color?: string;
  logo_url?: string;
  qr_url?: string;
  mensaje_bienvenida?: string;
  observaciones?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Provincia {
  id: number;
  nombre: string;
}

export interface FarmaciaCredencial {
  id?: number;
  farmacia_id: string;
  email_login: string;
  password_hash: string;
  created_at?: string;
}

export interface CodigoAutonumerico {
  id?: number;
  ultimo_numero: number;
  anio: number;
}
