// src/components/Gamification/AnimatedLevelUpModal.tsx

import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ArrowUpCircle, Award } from 'lucide-react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  oldLevel: number;
  newLevel: number;
}

const AnimatedLevelUpModal: React.FC<Props> = ({ visible, onClose, oldLevel, newLevel }) => {
  const progressBarAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      progressBarAnimation.setValue(0); // Reseta a animação
      Animated.timing(progressBarAnimation, {
        toValue: 100,
        duration: 1500, // Duração de 1.5 segundos
        useNativeDriver: false, // Animação de 'width' não suporta o driver nativo
      }).start();
    }
  }, [visible]);

  const animatedWidth = progressBarAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <Award size={40} color="#FBBF24" />
          </View>
          <Text style={styles.title}>LEVEL UP!</Text>
          <Text style={styles.subtitle}>Parabéns pela sua dedicação!</Text>
          
          <View style={styles.levelTransitionContainer}>
             <Text style={styles.levelText}>{oldLevel}</Text>
             <ArrowUpCircle size={30} color="#34D399" style={{ marginHorizontal: 10 }} />
             <Text style={styles.levelText}>{newLevel}</Text>
          </View>

          <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressBar, { width: animatedWidth }]} />
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Continuar Jornada</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFBEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FBBF24'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  levelTransitionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  progressContainer: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 6,
  },
  closeButton: {
    width: '100%',
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AnimatedLevelUpModal;