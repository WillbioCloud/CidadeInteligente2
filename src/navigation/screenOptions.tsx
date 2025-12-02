// src/navigation/screenOptions.tsx

import React from 'react';
import { StackNavigationOptions } from '@react-navigation/stack';
import CustomHeader from '../components/layout/CustomHeader';

/**
 * Configuração de tela que exibe o cabeçalho customizado.
 * Usada na maioria das telas do aplicativo.
 */
export const screenOptionsWithHeader: StackNavigationOptions = {
  header: (props) => <CustomHeader {...props} />,
  headerShown: true,
};

/**
 * Configuração de tela que OCULTA completamente o cabeçalho.
 * Usada em telas específicas como a do Mapa, que é tela cheia.
 */
export const screenOptionsWithoutHeader: StackNavigationOptions = {
  headerShown: false,
};