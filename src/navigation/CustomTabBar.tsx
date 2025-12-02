// src/navigation/CustomTabBar.tsx (VERSÃO FINAL COM LEITURA OTIMIZADA)

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUserStore } from '../hooks/useUserStore';
import { Home, Store, Trophy, Newspaper, User } from '../components/Icons';
import { designSystem, THEME_COLORS } from '../styles/designSystem';
import { LOTEAMENTOS_CONFIG } from '../data/loteamentos.data';

const icons = {
  Home, Comercios: Store, Gamificacao: Trophy, Feed: Newspaper, Conta: User,
};

export function CustomTabBar({ state, descriptors, navigation }) {
  // --- AQUI ESTÁ A CORREÇÃO ---
  // Em vez de pegar um objeto, pegamos cada valor separadamente.
  // Isso otimiza a renderização e remove o aviso.
  const selectedLoteamentoId = useUserStore((state) => state.selectedLoteamentoId);
  const _hasHydrated = useUserStore((state) => state._hasHydrated);
  // --- FIM DA CORREÇÃO ---

  if (!_hasHydrated) {
    return null;
  }

  const defaultTheme = THEME_COLORS['green'];
  let theme = defaultTheme;
  const colorName = LOTEAMENTOS_CONFIG[selectedLoteamentoId!]?.color;
  if(colorName && THEME_COLORS[colorName]) {
    theme = THEME_COLORS[colorName];
  }

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;
        const Icon = icons[label];
        const focusedColor = label === 'Gamificacao' ? theme.primary : designSystem.COLORS.green;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity key={index} style={styles.tabItem} onPress={onPress}>
            {Icon && (
              <View style={[styles.iconContainer, isFocused && [styles.iconContainerFocused, { backgroundColor: focusedColor }]]}>
                <Icon color={isFocused ? '#FFFFFF' : '#4B5563'} size={24} />
              </View>
            )}
            <Text style={[styles.tabLabel, isFocused && [styles.tabLabelFocused, { color: focusedColor }]]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: { position: 'absolute', bottom: 25, left: 20, right: 20, flexDirection: 'row', backgroundColor: 'white', borderRadius: 35, height: 70, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, justifyContent: 'space-around', alignItems: 'center' },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
  iconContainerFocused: { transform: [{ translateY: -4 }], elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 },
  tabLabel: { fontSize: 12, color: '#6B7280' },
  tabLabelFocused: { fontWeight: 'bold' },
});