// Local: /src/api/mapApi.ts

import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase'; // Importa o cliente Supabase

export const MAP_IMAGE_WIDTH = 3600;
export const MAP_IMAGE_HEIGHT = 1688;

export interface MapLocation {
  id: string;
  name: string;
  category: 'Saúde' | 'Comércio' | 'Lazer' | 'Serviços';
  address: string;
  hours: string;
  phone: string;
  rating: number;
  distance: string;
  hasPromo: boolean;
  categoryIcon: keyof typeof Ionicons.glyphMap;
  x: number;
  y: number;
}

// Nova função que busca dados do Supabase
export const fetchMapLocations = async (): Promise<MapLocation[]> => {
  const { data, error } = await supabase
    .from('map_locations')
    .select('*');

  if (error) {
    console.error("Erro ao buscar localizações do mapa:", error);
    return [];
  }

  // Mapeia os nomes do banco (snake_case) para os nomes que o app espera (camelCase)
  const formattedData = data.map(location => ({
    ...location,
    hasPromo: location.has_promo,
    x: location.x_coord,
    y: location.y_coord,
    categoryIcon: getIconForCategory(location.category),
  }));

  return formattedData;
};

// Função auxiliar para mapear categoria para ícone
const getIconForCategory = (category: string): keyof typeof Ionicons.glyphMap => {
    switch (category) {
        case 'Saúde': return 'medkit-outline';
        case 'Comércio': return 'cart-outline';
        case 'Lazer': return 'leaf-outline';
        case 'Serviços': return 'briefcase-outline';
        default: return 'help-circle-outline';
    }
}