import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zddvjgnrxwfhildukpjg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZHZqZ25yeHdmaGlsZHVrcGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwODUyMDksImV4cCI6MjA5MjY2MTIwOX0.WFM5D4UGFyqQIz_Iox2DOhGijGqZp3HtbfJe1kKszUU';

export const supabase = createClient(supabaseUrl, supabaseKey);
