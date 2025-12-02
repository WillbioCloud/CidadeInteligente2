// src/screens/Profile/ProfileTabScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../../hooks/useUserStore';
import { supabase } from '../../lib/supabase';
import { 
    User, 
    ChevronRight, 
    LogOut, 
    Settings, 
    Star, 
    Heart, 
    HelpCircle, 
    Award,
    Building,
    MoreHorizontal,
    FilePenLine 
} from 'lucide-react-native';

const MenuItem = ({ icon: Icon, label, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.menuIconContainer}>
            <Icon size={22} color="#4B5563" />
        </View>
        <Text style={styles.menuText}>{label}</Text>
        <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
);

export default function ProfileTabScreen() {
  const navigation = useNavigation();
  const { userProfile, clearStore } = useUserStore();
  const [rewardsCount, setRewardsCount] = useState(0);

  const userLevel = userProfile?.level || 1;
  const userXp = userProfile?.xp || 0;
  const achievementsCount = userProfile?.available_achievements?.length || 0;
  const userCoins = userProfile?.coins || 0;

  useEffect(() => {
    const fetchRewardsCount = async () => {
        if (!userProfile?.id) return;
        const { count, error } = await supabase
            .from('user_rewards')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userProfile.id);
        if (error) {
            console.error('Erro ao buscar contagem de recompensas:', error);
        } else if (count !== null) {
            setRewardsCount(count);
        }
    };
    fetchRewardsCount();
  }, [userProfile?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearStore();
  };

  if (!userProfile) {
      return (
          <SafeAreaView style={styles.container}>
              <View style={styles.header}>
                  <Text style={styles.headerTitle}>Perfil</Text>
              </View>
          </SafeAreaView>
      );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity style={styles.optionsButton}>
            <MoreHorizontal size={24} color="#334155" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
                <View style={styles.avatar}>
                    {userProfile.avatar_url ? (
                        <Image source={{ uri: userProfile.avatar_url }} style={styles.avatarImage} />
                    ) : ( <User size={40} color="#9CA3AF" /> )}
                </View>
                <View style={styles.profileText}>
                    <Text style={styles.userName}>{userProfile.full_name}</Text>
                    <Text style={styles.userEmail}>{userProfile.email}</Text>
                </View>
                <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
                    <FilePenLine size={20} color="#64748B" />
                </TouchableOpacity>
            </View>
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{achievementsCount}</Text>
                    <Text style={styles.statLabel}>Conquistas</Text>
                </View>
                <View style={styles.statSeparator} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{rewardsCount}</Text>
                    <Text style={styles.statLabel}>Recompensas</Text>
                </View>
                <View style={styles.statSeparator} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{userCoins}</Text>
                    <Text style={styles.statLabel}>Moedas</Text>
                </View>
            </View>
        </View>

        <View style={styles.gamificationCard}>
            <View style={styles.statBox}>
                <Text style={styles.gamificationLabel}>NÍVEL</Text>
                <View style={styles.statValueContainer}>
                    <Star size={20} color="#F59E0B" />
                    <Text style={styles.gamificationValue}>{userLevel}</Text>
                </View>
            </View>
            <View style={styles.gamificationSeparator} />
            <View style={styles.statBox}>
                <Text style={styles.gamificationLabel}>XP</Text>
                 <View style={styles.statValueContainer}>
                    <Heart size={20} color="#EF4444" />
                    <Text style={styles.gamificationValue}>{userXp}</Text>
                </View>
            </View>
        </View>

        {/* --- MENU DE OPÇÕES CORRIGIDO --- */}
        <View style={styles.menuContainer}>
            <MenuItem icon={Settings} label="Configurações" onPress={() => navigation.navigate('Settings')} />
            <MenuItem icon={Award} label="Minhas Conquistas" onPress={() => navigation.navigate('Achievements')} /> 
            <MenuItem icon={Building} label="Meus Empreendimentos" onPress={() => navigation.navigate('Empreendimentos')} />
            <MenuItem icon={HelpCircle} label="Ajuda e Suporte" onPress={() => navigation.navigate('Support')} />
            <MenuItem icon={LogOut} label="Sair" onPress={handleLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC',
    marginBottom: 75,
  },
  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: 'bold',
    color: '#1E293B',
  },
  optionsButton: {
    padding: 4,
  },
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 40 
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: '#F1F5F9', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  avatarImage: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 32 
  },
  profileText: {
    flex: 1,
  },
  userName: { 
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#1E293B',
  },
  userEmail: { 
    color: '#64748B', 
    marginTop: 2,
    fontSize: 14,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
  },
  statLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  statSeparator: {
    width: 1,
    backgroundColor: '#F1F5F9',
  },
  gamificationCard: { 
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statBox: { 
    flex: 1, 
    alignItems: 'center' 
  },
  gamificationLabel: { 
    color: '#9CA3AF', 
    fontWeight: '600', 
    marginBottom: 8,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  statValueContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  gamificationValue: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#334155', 
    marginLeft: 8 
  },
  gamificationSeparator: { 
    width: 1, 
    backgroundColor: '#F1F5F9' 
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: { 
    flex: 1, 
    fontSize: 16, 
    color: '#334155',
    fontWeight: '500',
  },
});
