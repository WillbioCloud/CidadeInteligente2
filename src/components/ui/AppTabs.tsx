import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeColors } from '../../hooks/useUserStore';
import { Ionicons } from '@expo/vector-icons';

interface AppTabsProps {
  tabs: string[];
  activeTab: string;
  onTabPress: (tab: string) => void;
  theme: ThemeColors;
}

export default function AppTabs({ tabs, activeTab, onTabPress, theme }: AppTabsProps) {
  const getIconForTab = (tabName: string, isActive: boolean) => {
    const color = isActive ? theme.primary : '#6B7280';
    switch (tabName) {
      case 'Diárias':
        return <Ionicons name={isActive ? 'flash' : 'flash-outline'} size={20} color={color} />;
      case 'Evolução':
        return <Ionicons name={isActive ? 'star' : 'star-outline'} size={20} color={color} />;
      default:
        return null;
    }
  };

  return (
    // NOVO CONTAINER QUE ENVOLVE AS ABAS
    <View style={styles.container}>
        <View style={styles.tabsContainer}>
        {tabs.map(tab => {
            const isActive = activeTab === tab;
            return (
            <TouchableOpacity
                key={tab}
                style={[styles.tabButton, isActive && styles.activeTabButton]}
                onPress={() => onTabPress(tab)}
            >
                {getIconForTab(tab, isActive)}
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab}
                </Text>
            </TouchableOpacity>
            );
        })}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginTop: 24,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 6,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        elevation: 1,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTabButton: {
        backgroundColor: '#F3F4F6', // Um cinza bem claro para o fundo ativo
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
        marginLeft: 8,
    },
    activeTabText: {
        color: '#1F2937', // Texto mais escuro para a aba ativa
    },
});