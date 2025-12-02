// src/components/ui/RewardPopup.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { designSystem } from '../../styles/designSystem';
import { PartyPopper } from 'lucide-react-native';
import { ThemeColors } from '../../hooks/useUserStore';

interface RewardPopupProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  points: number;
  theme: ThemeColors;
}

export default function RewardPopup(props: RewardPopupProps) {
  const { isVisible, onClose, title, points, theme } = props;
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (isVisible) {
      scale.value = withSpring(1, { damping: 15, stiffness: 120 });
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, [isVisible, scale, opacity]);

  const handleClose = () => {
    scale.value = withTiming(0.7, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      runOnJS(onClose)();
    }, 200);
  };

  return (
    <Modal
        animationType="none"
        transparent={true}
        visible={isVisible}
        onRequestClose={handleClose}
    >
        <View style={styles.overlay}>
            <Animated.View style={[styles.modalView, animatedStyle]}>
                <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
                    <PartyPopper size={40} color={designSystem.COLORS.white} />
                </View>
                <Text style={styles.titleText}>Recompensa Resgatada!</Text>
                <Text style={styles.missionText}>Pela missão "{title}"</Text>
                
                <View style={styles.pointsContainer}>
                  <Text style={[styles.pointsText, { color: theme.primary }]}>+{points}</Text>
                  <Text style={styles.pointsLabel}>pontos</Text>
                </View>

                <TouchableOpacity style={[styles.closeButton, { backgroundColor: theme.primary }]} onPress={handleClose}>
                    <Text style={styles.closeButtonText}>Incrível!</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
    modalView: { ...designSystem.STYLES.card, width: '85%', maxWidth: 340, padding: designSystem.SPACING.l, alignItems: 'center' },
    iconContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginTop: -60, elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, borderWidth: 4, borderColor: designSystem.COLORS.white },
    titleText: { ...designSystem.STYLES.text_h2, marginTop: designSystem.SPACING.m },
    missionText: { ...designSystem.STYLES.text_caption, textAlign: 'center', marginTop: designSystem.SPACING.xs, marginBottom: designSystem.SPACING.m },
    pointsContainer: { alignItems: 'center', marginVertical: designSystem.SPACING.m },
    pointsText: { fontFamily: designSystem.FONT_FAMILY.bold, fontSize: 52, lineHeight: 60 },
    pointsLabel: { ...designSystem.STYLES.text_body, marginTop: -designSystem.SPACING.s },
    closeButton: { width: '100%', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: designSystem.SPACING.m },
    closeButtonText: { fontFamily: designSystem.FONT_FAMILY.bold, color: designSystem.COLORS.white, fontSize: 16 }
});