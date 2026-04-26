import { createClient } from '@supabase/supabase-js';

// TODO: Para conectar tu base de datos real, pega aquí tus llaves de Supabase
// Estas llaves las encuentras en Supabase > Configuración del Proyecto > API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto-aqui.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-anon-key-aqui';

export const supabase = createClient(supabaseUrl, supabaseKey);
