// src/styles/designSystem.ts

import { StyleSheet } from 'react-native';

const COLORS = {
  blue: '#4A90E2',
  green: '#50E3C2',
  orange: '#F5A623',
  red: '#D0021B',
  black: '#121212',
  gray_dark: '#555555',
  gray_medium: '#888888',
  gray_light: '#CCCCCC',
  gray_extralight: '#F4F5F7',
  white: '#FFFFFF',
  dark_blue: '#1E3A8A',
  light_blue: '#3B82F6',
};

// 2. Temas de Cores para os Loteamentos
export const THEME_COLORS = {
  orange: { primary: '#F97316', accent: '#FB923C', light: '#FFF7ED', gradient: ['#F97316', '#EA580C'] },
  red: { primary: '#EF4444', accent: '#F87171', light: '#FEF2F2', gradient: ['#EF4444', '#DC2626'] },
  green: { primary: '#22C55E', accent: '#4ADE80', light: '#F0FDF4', gradient: ['#22C55E', '#16A34A'] },
  dark_blue: { primary: '#3B82F6', accent: '#60A5FA', light: '#EFF6FF', gradient: ['#3B82F6', '#2563EB'] },
  light_blue: { primary: '#0EA5E9', accent: '#38BDF8', light: '#F0F9FF', gradient: ['#0EA5E9', '#0284C7'] },
  purple: { primary: '#8B5CF6', accent: '#A78BFA', light: '#F5F3FF', gradient: ['#8B5CF6', '#7C3AED'] },
  brown: { primary: '#A16207', accent: '#CA8A04', light: '#FEFCE8', gradient: ['#A16207', '#854D0E'] },
};

// 3. Constantes de Espaçamento e Fontes
export const SPACING = {
  xs: 4, s: 8, m: 16, l: 24, xl: 40,
};

export const FONT_FAMILY = {
  regular: 'System', // Substitua pelos nomes das suas fontes
  semiBold: 'System',
  bold: 'System',
};

// 4. Estilos Globais Reutilizáveis
const globalStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.m,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  text_h1: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 28,
    color: COLORS.black,
  },
  // ... outros estilos globais
});

// 5. Exporta tudo em um único objeto para fácil acesso
export const designSystem = {
  COLORS,
  THEME_COLORS,
  SPACING,
  FONT_FAMILY,
  STYLES: globalStyles,
};