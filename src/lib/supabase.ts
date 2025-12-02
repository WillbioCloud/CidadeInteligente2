// Local: src/lib/supabase.ts (NOVO ARQUIVO)

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- 1. Importa o AsyncStorage

// Cole a URL e a Chave Anon do seu projeto Supabase aqui
const supabaseUrl = 'https://rexdzphtitpkzkguaata.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJleGR6cGh0aXRwa3prZ3VhYXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTU2ODIsImV4cCI6MjA2NjU3MTY4Mn0.GN1gPZol2sgo7_W5mw8IyjesQRErPHK7ezgOidWaspo';

// Crie e exporte o cliente para ser usado em outras partes do app

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});