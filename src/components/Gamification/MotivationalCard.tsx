import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../../hooks/useUserStore';

interface MotivationalCardProps {
    userName: string;
    loteamentoName: string;
    theme: ThemeColors;
}

export default function MotivationalCard({ userName, loteamentoName, theme }: MotivationalCardProps) {
  // O card agora usa a cor primária sólida do tema
  return (
    <View style={[styles.card, { backgroundColor: theme.primary }]}>
        <Ionicons name="sparkles-sharp" size={24} color="white" />
        <Text style={styles.text}>
            Continue assim, {userName}! Você está fazendo a diferença no {loteamentoName}.
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    card: { 
        marginHorizontal: 16, 
        marginTop: 24,
        borderRadius: 16, 
        padding: 20, 
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    text: { 
        color: 'white', 
        fontSize: 16, 
        fontWeight: '600', 
        textAlign: 'center', 
        marginTop: 8,
        lineHeight: 22,
    },
});
