// src/api/transportApi.ts (VERSÃO ATUALIZADA PARA A NOVA ESTRUTURA)

import { supabase } from '../lib/supabase';

// Interface que corresponde exatamente à sua nova tabela no Supabase
export interface BusSchedule {
  id: number;
  line_code: string;
  line_name: string;
  destination: string;
  point_a: string;
  point_b: string;
  status: 'em circulação' | 'manutenção' | 'interrompido';
  times_weekdays: string; // Ex: "05:00,06:15,07:30"
  times_saturday: string;
  times_sunday: string;
  ida: string;
  volta: string;
  created_at: string;
  updated_at: string;
}

// A função de busca foi atualizada para a nova tabela
export const fetchBusSchedules = async (): Promise<BusSchedule[]> => {
  const { data, error } = await supabase
    .from('bus_schedules')
    .select('*')
    .eq('status', 'em circulação') // Busca apenas as linhas que estão ativas
    .order('line_code', { ascending: true });

  if (error) {
    console.error("Erro ao buscar horários de ônibus:", error);
    return [];
  }

  // O Supabase já retorna os dados no formato correto
  return data as BusSchedule[];
};
