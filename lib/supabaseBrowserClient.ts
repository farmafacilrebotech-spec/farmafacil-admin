import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

// Cliente de Supabase para el navegador con Auth Helpers
// This will only be used at runtime in the browser, so env vars will be available
export const supabaseBrowser = createPagesBrowserClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
});
