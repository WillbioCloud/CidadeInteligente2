// src/components/layout/CustomHeader.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { Bell, User, Award, Star } from '../Icons';
import { useUserStore } from '../../hooks/useUserStore';
import { useModals } from '../../context/ModalContext';
import { supabase } from '../../lib/supabase';

interface CustomHeaderProps {
  onNotificationsPress: () => void;
}

export default function CustomHeader({ onNotificationsPress }: CustomHeaderProps) {
  const { userProfile } = useUserStore();
  const { showProfile } = useModals();
  const [hasUnread, setHasUnread] = useState(false);

  const firstName = userProfile?.full_name?.split(' ')[0] || 'Usuário';
  const displayedAchievements = userProfile?.displayed_achievements || [];
  const userLevel = userProfile?.level || 1;
  const avatarUrl = userProfile?.avatar_url;

  useEffect(() => {
    if (!userProfile?.id) return;

    // Função para verificar notificações não lidas
    const checkUnreadNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('id')
        .or(`user_id.eq.${userProfile.id},user_id.is.null`)
        .eq('is_read', false)
        .limit(1);

      if (error) {
        console.error("Erro ao verificar notificações:", error);
        return;
      }
      setHasUnread(data && data.length > 0);
    };

    checkUnreadNotifications();

    // Ouvinte em tempo real para novas notificações
    const subscription = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          // Se a nova notificação for para este utilizador ou para todos, marca como não lida
          if (payload.new.user_id === userProfile.id || payload.new.user_id === null) {
            setHasUnread(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userProfile?.id]);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.avatarContainer} onPress={showProfile}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={24} color="#4A90E2" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.userInfoContainer}>
          <View style={styles.userRow}>
            <Text style={styles.greetingText}>Olá, {firstName}!</Text>
            <View style={styles.levelContainer}>
              <Star size={14} color="#F5A623" />
              <Text style={styles.levelText}>{userLevel}</Text>
            </View>
          </View>

          <View style={styles.achievementsContainer}>
            {displayedAchievements.length > 0 ? (
              displayedAchievements.map((ach, index) => (
                <View key={index} style={styles.achievementTag}>
                  <Award size={10} color="#4338CA" />
                  <Text style={styles.achievementText}>{ach}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.loteamentoText}>Selecione as suas conquistas</Text>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.notificationButton} onPress={() => {
          onNotificationsPress();
          setHasUnread(false); // Otimisticamente marca como lido ao abrir
        }}>
          <Bell size={24} color="#333" />
          {hasUnread && <View style={styles.notificationDot} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EBF2FC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfoContainer: {
    flex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginRight: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 14,
    color: '#F5A623',
    marginLeft: 2,
  },
  loteamentoText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  notificationButton: {
    marginLeft: 12,
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  achievementsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  achievementTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 4,
  },
  achievementText: {
    color: '#4338CA',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 3,
  },
});
