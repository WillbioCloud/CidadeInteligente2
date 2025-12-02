import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Mission } from '../../data/missions.data';
import { ThemeColors } from '../../hooks/useUserStore';

interface InteractiveMissionCardProps {
  mission: Mission;
  theme: ThemeColors;
  progressInfo: { tasks: boolean[], completedBy: string | null };
  onToggleTask: (missionId: number, taskIndex: number) => void;
  onClaimReward: (mission: Mission) => void;
}

export default function InteractiveMissionCard({
  mission,
  theme,
  progressInfo,
  onToggleTask,
  onClaimReward
}: InteractiveMissionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedTasksCount = progressInfo?.tasks?.filter(Boolean).length || 0;
  const progressPercent = mission.tasks.length > 0 ? Math.round((completedTasksCount / mission.tasks.length) * 100) : 0;
  const isMissionCompleted = progressPercent === 100;
  const isClaimed = !!progressInfo?.completedBy;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(progressPercent, { duration: 400 });
  }, [progressPercent]);

  const animatedProgressStyle = useAnimatedStyle(() => ({ width: `${progress.value}%` }));

  const toggleExpansion = () => {
    if (isClaimed) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  if (isClaimed) {
    return (
        <View style={[styles.card, styles.claimedCard]}>
            <Ionicons name="checkmark-circle" size={24} color="#16A34A" style={styles.claimedIcon} />
            <View>
                <Text style={styles.claimedTitle}>{mission.title}</Text>
                <Text style={styles.claimedText}>Concluída por {progressInfo.completedBy}</Text>
            </View>
        </View>
    );
  }

  return (
    <View style={[styles.card, isMissionCompleted && styles.completedCard]}>
        <TouchableOpacity onPress={toggleExpansion} activeOpacity={0.8}>
            <View style={styles.cardHeader}>
                <Text style={styles.iconText}>{mission.icon}</Text>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{mission.title}</Text>
                    <Text style={styles.description}>{mission.description}</Text>
                </View>
                <View style={styles.pointsContainer}>
                    <Ionicons name="star" size={16} color="#FBBF24" />
                    <Text style={styles.pointsText}>{mission.points}</Text>
                </View>
            </View>
            <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                    <Animated.View style={[styles.progressBarForeground, animatedProgressStyle, { backgroundColor: isMissionCompleted ? '#22C55E' : theme.primary }]} />
                </View>
                <Text style={styles.progressText}>{isMissionCompleted ? 'Completa!' : `${progressPercent}%`}</Text>
            </View>
        </TouchableOpacity>

        {isExpanded && (
            <View style={styles.tasksContainer}>
                {mission.tasks.map((task, index) => {
                    const isTaskCompleted = progressInfo?.tasks?.[index] || false;
                    return (
                        <TouchableOpacity key={index} style={styles.taskItem} onPress={() => onToggleTask(mission.id, index)}>
                            <View style={[styles.checkbox, isTaskCompleted && { backgroundColor: theme.primary, borderColor: theme.primary }]}>
                                {isTaskCompleted && <Ionicons name="checkmark" size={16} color="#FFF" />}
                            </View>
                            <Text style={[styles.taskText, isTaskCompleted && styles.taskTextCompleted]}>{task}</Text>
                        </TouchableOpacity>
                    );
                })}

                {isMissionCompleted && (
                    <TouchableOpacity style={[styles.claimButton, { backgroundColor: '#22C55E' }]} onPress={() => onClaimReward(mission)}>
                        <Text style={styles.claimButtonText}>Resgatar Recompensa</Text>
                    </TouchableOpacity>
                )}
            </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
    card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6', elevation: 2 },
    completedCard: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
    cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
    iconText: { fontSize: 28, marginRight: 12, marginTop: 2 },
    textContainer: { flex: 1 },
    title: { fontSize: 16, fontWeight: 'bold', color: '#374151' },
    description: { fontSize: 14, color: '#6B7280', marginTop: 2 },
    pointsContainer: { alignItems: 'center', marginLeft: 12 },
    pointsText: { fontSize: 16, fontWeight: 'bold', color: '#4B5563', marginTop: 2 },
    progressContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    progressBarBackground: { flex: 1, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
    progressBarForeground: { height: '100%', borderRadius: 3 },
    progressText: { fontSize: 10, color: '#6B7280', marginLeft: 8 },
    tasksContainer: { borderTopWidth: 1, borderTopColor: '#F3F4F6', marginTop: 16, paddingTop: 16 },
    taskItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
    taskText: { fontSize: 14, color: '#333', flex: 1, marginLeft: 12 },
    taskTextCompleted: { textDecorationLine: 'line-through', color: '#A0A0A0' },
    claimButton: { paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    claimButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    claimedCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', borderRadius: 16, padding: 16, marginBottom: 12 },
    claimedIcon: { marginRight: 12 },
    claimedTitle: { fontSize: 16, fontWeight: 'bold', color: '#166534', textDecorationLine: 'line-through' },
    claimedText: { fontSize: 14, color: '#15803D', fontStyle: 'italic' },
});