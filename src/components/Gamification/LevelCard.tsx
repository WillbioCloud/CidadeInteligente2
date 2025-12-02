// src/components/Gamification/LevelCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Loteamento } from '../../data/loteamentos.data'; // Importando a interface Loteamento
import { ThemeColors } from '../../hooks/useUserStore';
import { designSystem, THEME_COLORS } from '../../styles/designSystem';
import { Award } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LevelCardProps {
  level: number;
  levelName: string;
  userName: string;
  loteamento: Loteamento; // <-- MUDANÇA: Recebe o objeto loteamento
  points: number;
  pointsToNextLevel: number;
  progressPercent: number;
  theme: ThemeColors;
  onPress: () => void;
  onLogoPress: () => void;
}

export default function LevelCard({
  level, levelName, userName, loteamento, // <-- MUDANÇA: Usando a prop loteamento
  points, pointsToNextLevel, progressPercent, theme,
  onPress, onLogoPress
}: LevelCardProps) {
  
  const gradientColors = THEME_COLORS[loteamento?.color || 'orange'].gradient;

  // Verificação de segurança
  if (!loteamento) {
    return null;
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.container}>
        <LinearGradient colors={gradientColors} style={styles.card}>
            <View style={styles.header}>
                <View style={styles.levelIconContainer}>
                    <Award size={18} color={designSystem.COLORS.white} />
                    <Text style={styles.levelText}>Nível {level}</Text>
                </View>
                <TouchableOpacity onPress={onLogoPress} style={styles.logoContainer}>
                    <Image source={loteamento.logo} style={styles.loteamentoLogo} />
                </TouchableOpacity>
            </View>
            
            <View style={styles.userInfo}>
                <Text style={styles.levelNameText}>{levelName}</Text>
                <Text style={styles.pointsText}>{points.toLocaleString('pt-BR')} Pontos</Text>
            </View>
            
            <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarForeground, { width: `${progressPercent}%` }]} />
                </View>
                {pointsToNextLevel > 0 ? (
                    <Text style={styles.progressText}>{pointsToNextLevel.toLocaleString('pt-BR')} para o próximo nível</Text>
                ) : (
                    <Text style={styles.progressText}>Parabéns! Você alcançou o nível máximo!</Text>
                )}
            </View>
        </LinearGradient>
    </TouchableOpacity>
  );
}

// Estilos continuam os mesmos...
const styles = StyleSheet.create({
    container: { marginHorizontal: designSystem.SPACING.m, marginTop: designSystem.SPACING.m },
    card: { ...designSystem.STYLES.card, padding: designSystem.SPACING.l, overflow: 'hidden' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    levelIconContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    levelText: { fontFamily: designSystem.FONT_FAMILY.semiBold, color: designSystem.COLORS.white, fontSize: 14, marginLeft: designSystem.SPACING.s },
    logoContainer: { padding: designSystem.SPACING.xs, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20 },
    loteamentoLogo: { width: 32, height: 32, resizeMode: 'contain' },
    userInfo: { marginTop: designSystem.SPACING.l },
    levelNameText: { fontFamily: designSystem.FONT_FAMILY.bold, fontSize: 24, color: designSystem.COLORS.white },
    pointsText: { fontFamily: designSystem.FONT_FAMILY.semiBold, fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    progressContainer: { marginTop: designSystem.SPACING.l },
    progressBarBackground: { height: 8, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4, overflow: 'hidden' },
    progressBarForeground: { height: 8, backgroundColor: designSystem.COLORS.white, borderRadius: 4 },
    progressText: { fontFamily: designSystem.FONT_FAMILY.medium, color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 6 },
});