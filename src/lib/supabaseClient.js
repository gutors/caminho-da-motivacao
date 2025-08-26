import { createClient } from '@supabase/supabase-js';

// IMPORTANTE: Crie um arquivo .env.local na raiz do seu projeto
// e adicione as seguintes variáveis de ambiente:
// VITE_SUPABASE_URL=URL_DO_SEU_PROJETO_SUPABASE
// VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_SUPABASE

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
