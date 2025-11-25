import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

// Cliente de Supabase para el navegador con Auth Helpers
export const supabaseBrowser = createPagesBrowserClient();
