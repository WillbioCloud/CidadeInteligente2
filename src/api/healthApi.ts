// Local: src/api/healthApi.ts (VERSÃO "BUFADA" E ATUALIZADA)

import { supabase } from '../lib/supabase';

// --- INTERFACES (Tipos de Dados) ---

// 2. Ampliando as categorias, como você sugeriu
export type HealthCategory =
  | 'Alerta Local'
  | 'Saúde na Cidade'
  | 'Alimentação'
  | 'Exercícios'
  | 'Saúde Mental'
  | 'Dengue e Mosquitos'
  | 'Primeiros Socorros'
  | 'Receitas Saudáveis'
  | 'Horta e Jardinagem'
  | 'Cozinha Funcional'
  | 'Cidades Inteligentes';

export interface HealthInfo {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: HealthCategory; // Usando o novo tipo expandido
  readTime: string;
  imageKey: string;
  source: string;
  tips?: string[];
  address?: string;
  phone?: string;
  created_at: string;
}

export interface NutritionInfo {
  // ... (interface existente, sem alterações)
  name: string;
  calories: number;
  serving_size_g: number;
  fat_total_g: number;
  fat_saturated_g: number;
  protein_g: number;
  sodium_mg: number;
  potassium_mg: number;
  cholesterol_mg: number;
  carbohydrates_total_g: number;
  fiber_g: number;
  sugar_g: number;
}

export interface HealthAlert {
  // ... (interface existente, sem alterações)
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  source: string;
}

// 5. Novo tipo para receitas, como você pediu
export interface RecipeInfo {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string;
  category: 'Café da Manhã' | 'Almoço' | 'Jantar' | 'Lanches Saudáveis' | 'Pré-treino' | 'Vegano';
  calories?: number;
  imageKey?: string;
}


// --- FUNÇÕES DE BUSCA DE DADOS ---

/**
 * Busca a lista principal de dicas de saúde da tabela 'health_info'.
 */
export const fetchHealthData = async (): Promise<HealthInfo[]> => {
  const { data, error } = await supabase
    .from('health_info')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar dados de saúde:', error);
    return [];
  }

  // Mapeia os nomes do banco (snake_case) para os nomes que o app espera (camelCase)
  const formattedData = data.map(item => ({
    ...item,
    readTime: item.read_time,
    imageKey: item.image_key,
  }));

  return formattedData as HealthInfo[];
};

/**
 * Busca a lista de alertas importantes da tabela 'health_alerts'.
 */
export const fetchHealthAlerts = async (): Promise<HealthAlert[]> => {
  // ... (função existente, sem alterações)
  const { data, error } = await supabase
    .from('health_alerts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar alertas de saúde:', error);
    return [];
  }
  return data as HealthAlert[];
};

/**
 * CHAMA A EDGE FUNCTION para buscar dados nutricionais na API-Ninjas.
 */
export const fetchNutritionInfo = async (query: string): Promise<NutritionInfo[]> => {
  // ... (função existente, sem alterações)
  const { data, error } = await supabase.functions.invoke('get-nutrition-info', {
    body: { query },
  });

  if (error) {
    console.error("Erro ao chamar a função de nutrição:", error);
    return [];
  }
  return data as NutritionInfo[];
};

// 3. Nova função para buscar por área específica, conforme seu código
export const fetchHealthByCategory = async (category: HealthCategory): Promise<HealthInfo[]> => {
  const { data, error } = await supabase
    .from('health_info')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Erro ao buscar dados da categoria ${category}:`, error);
    return [];
  }

  return data as HealthInfo[];
};