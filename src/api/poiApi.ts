// src/api/poiApi.ts (VERSÃO FINAL E CORRIGIDA)

import { supabase } from '../lib/supabase';

// Interface simplificada para os Pontos de Interesse de infraestrutura
export interface PointOfInterest {
  id: string;
  loteamento_id: string;
  name: string;
  category: string;
  // Latitude e Longitude são opcionais, pois podemos não ter no cadastro inicial
  latitude?: number;
  longitude?: number;
}

// Busca os Pontos de Interesse para um loteamento específico
export const fetchPoisForLoteamento = async (loteamentoId: string): Promise<PointOfInterest[]> => {
  // Retorna um array vazio se o ID do loteamento não for fornecido
  if (!loteamentoId) return [];

  const { data, error } = await supabase
    .from('points_of_interest') // Busca da nova tabela 'points_of_interest'
    .select('*')
    .eq('loteamento_id', loteamentoId);

  if (error) {
    console.error("Erro ao buscar Pontos de Interesse:", error);
    return []; // Retorna um array vazio em caso de erro
  }

  return data as PointOfInterest[];
};