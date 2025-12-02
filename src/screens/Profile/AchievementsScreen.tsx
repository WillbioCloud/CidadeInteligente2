// src/screens/Profile/AchievementsScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    FlatList, 
    ActivityIndicator,
    Image
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../hooks/useUserStore';
import { ArrowLeft, Medal, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Interface para os dados da tabela 'achievements'
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  rarity: 'Junior' | 'Senior' | 'Star';
  xp_reward: number;
  is_earned?: boolean; // Adicionamos este campo para controle
}

// --- NOVO AchievementCard Component ---
const AchievementCard = ({ item }: { item: Achievement }) => {
    const getRarityStyle = (rarity: string) => {
        switch (rarity) {
            case 'Star': return { color: '#FBBF24', label: 'Estrela' };
            case 'Senior': return { color: '#34D399', label: 'Sênior' };
            case 'Junior': return { color: '#A78BFA', label: 'Júnior' };
            default: return { color: '#9CA3AF', label: 'Comum' };
        }
    };

    const rarityStyle = getRarityStyle(item.rarity);

    return (
        <View style={[styles.card, !item.is_earned && styles.cardLocked]}>
            <Image source={{ uri: item.icon_url }} style={styles.cardIcon} />
            <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
            
            <View style={[styles.rarityBadge, { backgroundColor: `${rarityStyle.color}20` }]}>
                <Star size={12} color={rarityStyle.color} fill={rarityStyle.color} />
                <Text style={[styles.rarityText, { color: rarityStyle.color }]}>{rarityStyle.label}</Text>
            </View>

            {item.is_earned ? (
                <Text style={styles.statusTextCompleted}>Concluído</Text>
            ) : (
                <>
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { width: '50%' }]} />
                    </View>
                    <Text style={styles.statusTextNext}>Próximo</Text>
                </>
            )}
        </View>
    );
};


// --- TELA PRINCIPAL ---
export default function AchievementsScreen({ navigation }) {
  const { userProfile } = useUserStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // --- A CORREÇÃO ESTÁ AQUI ---
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (!userProfile?.id) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        // 1. Buscar todas as conquistas disponíveis
        const { data: allAchievements, error: achievementsError } = await supabase
          .from('achievements')
          .select('*');

        // 2. Buscar os IDs das conquistas que o usuário já ganhou
        const { data: userAchievementsData, error: userAchievementsError } = await supabase
          .from('user_achievements')
          .select('achievement_id')
          .eq('user_id', userProfile.id);

        if (achievementsError || userAchievementsError) {
          console.error(achievementsError || userAchievementsError);
          setLoading(false);
          return;
        }

        const earnedIds = new Set(userAchievementsData.map(ua => ua.achievement_id));
        
        // 3. Combinar os dados: marcar quais foram ganhas
        const finalAchievements = allAchievements.map(ach => ({
            ...ach,
            is_earned: earnedIds.has(ach.id),
        }));

        setAchievements(finalAchievements);
        setLoading(false);
      };

      fetchData();
    }, [userProfile?.id])
  );

  const earnedCount = achievements.filter(a => a.is_earned).length;
  const totalCount = achievements.length;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={StyleSheet.absoluteFill} />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas Honras</Text>
        <View style={{width: 40}} />
      </View>

      {/* Card de Progresso */}
      <View style={styles.progressCard}>
        <View style={styles.medalIconContainer}>
            <Medal size={32} color="#FBBF24" />
        </View>
        <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Conquistas</Text>
            <Text style={styles.progressCount}>{earnedCount} / {totalCount}</Text>
        </View>
      </View>

      {/* Grelha de Conquistas */}
      {loading ? (
        <ActivityIndicator size="large" color="#FFF" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={achievements}
          keyExtractor={item => item.id}
          numColumns={2}
          renderItem={({ item }) => <AchievementCard item={item} />}
          contentContainerStyle={styles.gridContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma conquista encontrada.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

// --- ESTILOS (sem alterações) ---
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
    progressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    medalIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(251, 191, 36, 0.3)',
    },
    progressInfo: { flex: 1, marginLeft: 16 },
    progressTitle: { color: 'white', fontSize: 18, fontWeight: '600' },
    progressCount: { color: '#E5E7EB', fontSize: 14 },
    gridContainer: { paddingHorizontal: 16, paddingBottom: 40 },
    card: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: 16,
        margin: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    cardLocked: { opacity: 0.6 },
    cardIcon: { width: 64, height: 64, marginBottom: 12 },
    cardTitle: { color: 'white', fontWeight: 'bold', fontSize: 16, marginBottom: 8, textAlign: 'center' },
    rarityBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
    rarityText: { fontWeight: 'bold', fontSize: 12 },
    progressContainer: {
        width: '80%',
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 3,
        marginTop: 8,
    },
    progressBar: { height: '100%', backgroundColor: '#34D399', borderRadius: 3 },
    statusTextNext: { fontSize: 12, color: '#A7F3D0', marginTop: 4 },
    statusTextCompleted: { fontSize: 14, color: '#6EE7B7', fontWeight: '600', marginTop: 12 },
    emptyText: { color: 'white', textAlign: 'center', marginTop: 50 },
})