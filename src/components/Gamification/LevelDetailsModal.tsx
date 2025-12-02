import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLoteamentos } from '../../hooks/useUserStore';
import { LEVELS_DATA } from '../../data/levels.data';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface LevelDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  currentLevel: number;
  userPoints: number; 
  totalPointsForNextLevel: number;
}

export default function LevelDetailsModal({ isVisible, onClose, currentLevel, userPoints, totalPointsForNextLevel }: LevelDetailsModalProps) {
  const levelInfo = LEVELS_DATA[currentLevel];
  const nextLevelInfo = LEVELS_DATA[currentLevel + 1];

  const progress = useSharedValue(0);
  useEffect(() => {
    if (isVisible) {
      // Cálculo seguro para a porcentagem
      const pointsInLevel = userPoints - (levelInfo?.pointsRequired || 0);
      const totalPointsForLevel = totalPointsForNextLevel - (levelInfo?.pointsRequired || 0);
      const percent = totalPointsForLevel > 0 ? (pointsInLevel / totalPointsForLevel) * 100 : 0;
      progress.value = withTiming(percent, { duration: 800 });
    } else {
      progress.value = 0; // Reseta a animação ao fechar
    }
  }, [isVisible, userPoints, totalPointsForNextLevel, levelInfo]);

  const animatedProgressStyle = useAnimatedStyle(() => ({ width: `${progress.value}%` }));

  if (!levelInfo) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={32} color="#FFF" />
          </TouchableOpacity>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <LinearGradient colors={['#8E2DE2', '#4A00E0']} style={styles.header}>
              <Ionicons name={levelInfo.icon as any} size={40} color="white" />
              <Text style={styles.levelTitle}>Nível {currentLevel}: {levelInfo.name}</Text>
              <Text style={styles.headerSubtitle}>Seu progresso e benefícios</Text>
            </LinearGradient>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🌟 Benefícios Desbloqueados</Text>
              {levelInfo.benefits.map((benefit, index) => (
                <View key={index} style={styles.listItem}>
                    <Ionicons name="sparkles" size={18} color="#FFD700" />
                    <Text style={styles.listText}>{benefit}</Text>
                </View>
              ))}
            </View>
            
            {nextLevelInfo && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎯 Rumo ao Nível {currentLevel + 1}: {nextLevelInfo.name}</Text>
                <Text style={styles.progressLabel}>{userPoints} / {totalPointsForNextLevel} Pontos</Text>
                <View style={styles.progressBarBackground}>
                    <Animated.View style={[styles.progressBarFill, animatedProgressStyle]}/>
                </View>
                
                {/* Verificação de segurança adicionada aqui */}
                {Array.isArray(nextLevelInfo.nextLevelRequirements) && nextLevelInfo.nextLevelRequirements.map((req, index) => (
                  <View key={index} style={styles.checklistItem}>
                    <Ionicons name="shield-checkmark-outline" size={18} color="#6C757D" />
                    <Text style={styles.listText}>{req}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📜 Sua Jornada</Text>
              {Object.keys(LEVELS_DATA).map(levelStr => parseInt(levelStr)).filter(level => level <= currentLevel).reverse().map((level, index, arr) => (
                  <View key={level} style={styles.historyItem}>
                      <View style={styles.timelineDot}>
                        <Ionicons name="trophy" size={18} color="white" />
                      </View>
                      {index < arr.length - 1 && <View style={styles.timelineConnector}/>}
                      <Text style={styles.listText}><Text style={{fontWeight: 'bold'}}>Nível {level}:</Text> {LEVELS_DATA[level].name} alcançado!</Text>
                  </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// Estilos limpos e sem duplicatas
const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalView: { width: '90%', maxHeight: '85%', backgroundColor: '#F4F6F8', borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 10, overflow: 'hidden' },
  closeButton: { position: 'absolute', top: 10, right: 10, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16},
  header: { alignItems: 'center', padding: 24 },
  levelTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', marginTop: 12 },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  section: { marginHorizontal: 16, marginTop: 16, backgroundColor: 'white', padding: 16, borderRadius: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  listItem: { fontSize: 15, color: '#555', lineHeight: 22, flex: 1 }, // Adicionado flex: 1
  listText: { fontSize: 15, color: '#555', lineHeight: 22, marginLeft: 12 },
  checklistItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  historyItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  progressLabel: { textAlign: 'right', color: '#6C757D', fontSize: 12, marginBottom: 4 },
  progressBarBackground: { height: 12, backgroundColor: '#E9ECEF', borderRadius: 6, marginBottom: 16, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#28a745', borderRadius: 6 },
  timelineDot: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFC107', justifyContent: 'center', alignItems: 'center', marginRight: 12, zIndex: 5 },
  timelineConnector: { position: 'absolute', top: 36, left: 18, width: 2, height: '100%', backgroundColor: '#E9ECEF' },
});