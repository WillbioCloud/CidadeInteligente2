// src/components/Gamification/AchievementsCatalog.modal.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { ALL_ACHIEVEMENTS, CATEGORIES, Achievement } from '../../data/achievements.data';
import { designSystem } from '../../styles/designSystem';
import { X, Trophy, Star, Medal } from 'lucide-react-native';

/**
 * @typedef {Object} AchievementsCatalogProps
 * @property {boolean} isVisible
 * @property {() => void} onClose
 */

const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'Bronze': return { iconColor: '#A97142', badgeColor: '#F0E6D8' };
      case 'Prata': return { iconColor: '#A8A8A8', badgeColor: '#EAEAEA' };
      case 'Ouro': return { iconColor: '#F7B500', badgeColor: '#FFF8E1' };
      case 'Platina': return { iconColor: '#4A90E2', badgeColor: '#EAF2FB' };
      case 'Diamante': return { iconColor: '#50E3C2', badgeColor: '#E4FAF5' };
      default: return { iconColor: designSystem.COLORS.gray_medium, badgeColor: designSystem.COLORS.gray_extralight };
    }
};

const AchievementItem = ({ achievement }: { achievement: Achievement }) => {
    const { iconColor, badgeColor } = getDifficultyStyle(achievement.difficulty);
    const isSecret = achievement.secret && !achievement.earned;

    return (
        <View style={designSystem.STYLES.card}>
            <View style={styles.achievementHeader}>
                <View style={[styles.difficultyBadge, { backgroundColor: badgeColor }]}>
                    <Medal size={16} color={iconColor} />
                    <Text style={[styles.difficultyText, { color: iconColor }]}>{achievement.difficulty}</Text>
                </View>
                <View style={styles.pointsBadge}>
                    <Star size={14} color={designSystem.COLORS.orange} />
                    <Text style={styles.pointsText}>{achievement.points}</Text>
                </View>
            </View>
            <Text style={styles.achievementTitle}>{isSecret ? '???' : achievement.title}</Text>
            <Text style={styles.achievementDesc}>{achievement.description}</Text>
        </View>
    );
};
/** @param {AchievementsCatalogProps} props */
export default function AchievementsCatalogModal(props) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const earnedCount = ALL_ACHIEVEMENTS.filter(a => a.earned).length;

  const filteredAchievements = selectedCategory === 'all'
    ? ALL_ACHIEVEMENTS
    : ALL_ACHIEVEMENTS.filter(a => a.category === selectedCategory);

  return (
    <Modal animationType="slide" visible={props.isVisible} onRequestClose={props.onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={designSystem.STYLES.text_h1}>Conquistas</Text>
            <TouchableOpacity onPress={props.onClose} style={styles.closeButton}>
              <X size={24} color={designSystem.COLORS.gray_dark} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsHeader}>
              <Trophy size={20} color={designSystem.COLORS.orange} />
              <Text style={styles.statsText}>
                  <Text style={{ fontFamily: designSystem.FONT_FAMILY.bold }}>{earnedCount}</Text> de {ALL_ACHIEVEMENTS.length} conquistadas
              </Text>
          </View>

          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity 
                  key={cat.id} 
                  style={[styles.filterButton, selectedCategory === cat.id && styles.activeFilter]} 
                  onPress={() => setSelectedCategory(cat.id)}>
                    <Text style={[styles.filterText, selectedCategory === cat.id && styles.activeFilterText]}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
            {filteredAchievements.map(ach => <AchievementItem key={ach.id} achievement={ach} />)}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: designSystem.COLORS.gray_extralight },
    modalContainer: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: designSystem.SPACING.m },
    closeButton: { padding: designSystem.SPACING.s, backgroundColor: designSystem.COLORS.white, borderRadius: 20 },
    statsHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: designSystem.SPACING.m, paddingVertical: designSystem.SPACING.s, backgroundColor: designSystem.COLORS.white, marginHorizontal: designSystem.SPACING.m, borderRadius: 12, marginBottom: designSystem.SPACING.m },
    statsText: { ...designSystem.STYLES.text_body, marginLeft: designSystem.SPACING.s },
    filterContainer: { paddingHorizontal: designSystem.SPACING.m, paddingBottom: designSystem.SPACING.m },
    filterButton: { backgroundColor: designSystem.COLORS.white, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#E5E7EB' },
    activeFilter: { backgroundColor: designSystem.COLORS.black, borderColor: designSystem.COLORS.black },
    filterText: { ...designSystem.STYLES.text_caption, fontFamily: designSystem.FONT_FAMILY.semiBold },
    activeFilterText: { color: designSystem.COLORS.white },
    listContainer: { paddingHorizontal: designSystem.SPACING.m, paddingBottom: 50 },
    achievementHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: designSystem.SPACING.s },
    difficultyBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 20 },
    difficultyText: { fontFamily: designSystem.FONT_FAMILY.semiBold, fontSize: 12, marginLeft: 4 },
    pointsBadge: { flexDirection: 'row', alignItems: 'center' },
    pointsText: { fontFamily: designSystem.FONT_FAMILY.bold, color: designSystem.COLORS.orange, marginLeft: 4 },
    achievementTitle: { ...designSystem.STYLES.text_h2, fontSize: 18, marginTop: designSystem.SPACING.xs },
    achievementDesc: { ...designSystem.STYLES.text_caption, marginTop: designSystem.SPACING.xs },
});