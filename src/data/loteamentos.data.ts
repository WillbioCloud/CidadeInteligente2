// src/data/loteamentos.data.ts (VERSÃO COM NOVAS REGIÕES E COORDENADAS)

import { ImageSourcePropType } from 'react-native';

export interface Loteamento {
  id: string;
  name: string;
  city: string;
  logo: ImageSourcePropType;
  color: 'red' | 'green' | 'light_blue' | 'dark_blue' | 'orange' | 'purple' | 'brown';
  tagline: string;
  highlights: string[];
  bounds?: { north: number; south: number; west: number; east: number; };
  center?: { lat: number; lon: number; };
}

export const ALL_LOTEAMENTOS: Loteamento[] = [
    {
      id: 'cidade_inteligente',
      name: 'Cidade Inteligente',
      city: 'Santo Antônio do Descoberto - GO',
      logo: require('../assets/logos/LOGO-CIDADE-INTELIGENTE.webp'),
      color: 'orange',
      tagline: 'Sua vida urbana do jeito inteligente.',
      highlights: ['Infraestrutura completa', 'Lazer e conveniência', 'Localização estratégica'],
      bounds: { north: -15.940289, south: -15.952700, west: -48.319283, east: -48.313345 },
      center: { lat: -15.946495, lon: -48.316314 }
    },
    {
      id: 'cidade_universitaria',
      name: 'Cidade Universitária',
      city: 'Caldas Novas - GO',
      logo: require('../assets/logos/LOGO-CIDADE-UNIVERSITARIA.webp'),
      color: 'light_blue',
      tagline: 'Educação e qualidade de vida em um só lugar.',
      highlights: ['Próximo a universidades', 'Planejamento urbano', 'Ótima oportunidade'],
      center: { lat: -17.701539, lon: -48.598748 },
    },
    {
      id: 'cidade_verde',
      name: 'Cidade Verde',
      city: 'Caldas Novas - GO',
      logo: require('../assets/logos/LOGO-CIDADE-VERDE.webp'),
      color: 'green',
      tagline: 'Viva em harmonia com a natureza.',
      highlights: ['Áreas verdes preservadas', 'Qualidade do ar', 'Lotes amplos'],
      center: { lat: -17.707119, lon: -48.603501 },
    },
    {
      id: 'cidade_das_flores',
      name: 'Cidade das Flores',
      city: 'Caldas Novas - GO',
      logo: require('../assets/logos/LOGO-CIDADE-DAS-FLORES.webp'),
      color: 'red',
      tagline: 'Um jardim para você chamar de lar.',
      highlights: ['Paisagismo exuberante', 'Ruas floridas', 'Ambiente familiar'],
      center: { lat: -17.775992, lon: -48.630007 },
    },
    {
      id: 'lago_sul',
      name: 'Setor Lago Sul',
      city: 'Caldas Novas - GO',
      logo: require('../assets/logos/LOGO-LAGO-SUL.webp'),
      color: 'dark_blue',
      tagline: 'Alto padrão com vista para o lago.',
      highlights: ['Localização privilegiada', 'Infraestrutura de luxo', 'Segurança reforçada'],
      center: { lat: -17.760062, lon: -48.582653 },
    },
    {
      id: 'residencial_morada_nobre',
      name: 'Residencial Morada Nobre',
      city: 'Caldas Novas - GO',
      logo: require('../assets/logos/LOGO-MORADA-NOBRE.webp'),
      color: 'brown',
      tagline: 'O conforto que sua família merece.',
      highlights: ['Lotes espaçosos', 'Área de lazer', 'Fácil acesso'],
    },
    {
      id: 'caminho_do_lago',
      name: 'Caminho do Lago',
      city: 'Caldas Novas - GO',
      logo: require('../assets/logos/LOGO-CAMINHO-DO-LAGO.webp'),
      color: 'light_blue',
      tagline: 'Seu refúgio à beira do lago.',
      highlights: ['Próximo ao lago', 'Natureza', 'Ideal para relaxar'],
    },
    {
      id: 'parque_flamboyant',
      name: 'Parque Flamboyant',
      city: 'Caldas Novas - GO',
      logo: require('../assets/logos/LOGO-FLAMBOYANT.webp'),
      color: 'purple',
      tagline: 'Um novo conceito de moradia.',
      highlights: ['Infraestrutura moderna', 'Lazer completo', 'Excelente investimento'],
    },
    // --- NOVAS REGIÕES ADICIONADAS ---
    {
      id: 'shopping_singapura',
      name: 'Shopping Singapura',
      city: 'Caldas Novas - GO',
      logo: require('../assets/logos/LOGO-CIDADE-INTELIGENTE.webp'), // Usando um logo genérico
      color: 'purple',
      tagline: 'O ponto de encontro da cidade.',
      highlights: ['Comércio variado', 'Praça de alimentação', 'Cinema'],
      center: { lat: -17.741793, lon: -48.632532 },
    },
    {
      id: 'sede_fbz',
      name: 'Sede FBZ Empreendimentos',
      city: 'Caldas Novas - GO',
      logo: require('../assets/logos/LOGO-CIDADE-INTELIGENTE.webp'), // Usando um logo genérico
      color: 'dark_blue',
      tagline: 'Realizando sonhos, construindo futuros.',
      highlights: ['Atendimento ao cliente', 'Novos projetos', 'Administrativo'],
      center: { lat: -17.744024, lon: -48.622329 },
    },
];

export const LOTEAMENTOS_CONFIG: { [key: string]: Loteamento } = ALL_LOTEAMENTOS.reduce((acc, loteamento) => {
    acc[loteamento.id] = loteamento;
    return acc;
}, {});