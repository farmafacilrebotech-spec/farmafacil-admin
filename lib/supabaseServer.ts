import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Cliente de Supabase para Server Components
export const createServerClient = () => {
  return createServerComponentClient({ cookies });
};

