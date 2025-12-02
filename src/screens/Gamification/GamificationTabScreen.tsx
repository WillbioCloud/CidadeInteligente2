// src/screens/Gamification/GamificationTabScreen.tsx (VERSÃO CORRIGIDA E OTIMIZADA)

import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView,
    Image,
    Modal,
    Alert,
    TouchableOpacity,
    RefreshControl,
    TextInput,
    FlatList,
    Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../hooks/useUserStore';
import { Medal, Trophy, X, Backpack, Coins, Check, ShoppingCart, Gift, Sparkles, ArrowUpCircle } from 'lucide-react-native';
import MissionCard from '../../components/Gamification/MissionCard';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AnimatedLevelUpModal from '../../components/Gamification/AnimatedLevelUpModal';

// --- INTERFACES ---
export interface Mission {
    id: string;
    title: string;
    description: string;
    xp_reward: number;
    coin_reward: number;
    location_type: 'cidade_inteligente' | 'santo_antonio';
    type: 'QR_CODE' | 'CODE';
    completion_data: string;
    is_completed?: boolean;
}

interface LeaderboardUser {
    id: string;
    full_name: string;
    avatar_url: string | null;
    xp: number;
    level: number;
}

interface Reward {
    id: string;
    title: string;
    description: string;
    cost_in_coins: number;
    image_url: string;
    is_purchased?: boolean;
    is_active?: boolean;
    mission_id_unlock?: string;
}

// --- CONSTANTES DO CARROSSEL ---
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_SPACING = 16;
const CARD_SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;

// --- COMPONENTES INTERNOS ---
const levelData = { 1: { xp_needed: 100 }, 2: { xp_needed: 250 }, 3: { xp_needed: 500 }, 4: { xp_needed: 1000 }, 5: { xp_needed: 2000 } };

const Avatar = ({ url, name, style }) => {
    const getInitials = () => (name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?');
    return (
        <View style={[style, styles.avatarBase]}>
            {url ? <Image source={{ uri: url }} style={styles.avatarImage} /> : <Text style={styles.avatarText}>{getInitials()}</Text>}
        </View>
    );
};

const ProgressBar = ({ progress, height = 8, color = '#10B981' }) => (
    <View style={[styles.progressContainer, { height }]}>
        <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: color }]} />
    </View>
);

const MyScoreCard = ({ profile }) => {
    const currentLevel = profile?.level || 1;
    const currentXp = profile?.xp || 0;
    const userCoins = profile?.coins || 0;
    const xpForNextLevel = levelData[currentLevel]?.xp_needed || levelData[Object.keys(levelData).length].xp_needed;
    const xpForPreviousLevels = currentLevel > 1 ? levelData[currentLevel - 1]?.xp_needed || 0 : 0;
    const xpInCurrentLevel = currentXp - xpForPreviousLevels;
    const xpNeededForThisLevel = xpForNextLevel - xpForPreviousLevels;
    const progressPercentage = xpNeededForThisLevel > 0 ? Math.max(0, Math.min(100, (xpInCurrentLevel / xpNeededForThisLevel) * 100)) : 100;

    return (
        <View style={styles.myScoreCard}>
            <View style={styles.rankBadge}><Text style={styles.rankText}>RANK {profile?.rank || 'N/A'}</Text></View>
            <Avatar url={profile?.avatar_url} name={profile?.full_name} style={styles.myAvatar} />
            <Text style={styles.myUsername}>{profile?.full_name || 'Você'}</Text>
            <View style={styles.xpProgressSection}>
                <Text style={styles.progressText}>{currentXp} / {xpForNextLevel} XP</Text>
                <ProgressBar progress={progressPercentage} color="#3B82F6" />
            </View>
            <View style={styles.myStatsContainer}>
                <View style={styles.statBox}><Coins size={20} color="#F59E0B" /><Text style={styles.statValue}>{userCoins}</Text><Text style={styles.statLabel}>Moedas</Text></View>
                <View style={styles.statBox}><Medal size={20} color="#3B82F6" /><Text style={styles.statValue}>{currentLevel}</Text><Text style={styles.statLabel}>Nível Atual</Text></View>
                <View style={styles.statBox}><Trophy size={20} color="#10B981" /><Text style={styles.statValue}>{currentXp}</Text><Text style={styles.statLabel}>Total XP</Text></View>
            </View>
        </View>
    );
};

const RewardCard = ({ reward, userCoins, onPurchase }) => {
    const canAfford = userCoins >= reward.coin_cost;
    return (
        <View style={styles.rewardCard}>
            <Image source={{ uri: reward.image_url }} style={styles.rewardImage} />
            <View style={styles.rewardInfo}>
                <Text style={styles.rewardTitle}>{reward.title}</Text>
                <Text style={styles.rewardDescription}>{reward.description}</Text>
            </View>
            <TouchableOpacity
                style={[
                    styles.purchaseButton,
                    reward.is_purchased
                        ? styles.purchasedButton
                        : canAfford
                        ? styles.canAffordButton
                        : styles.cantAffordButton,
                ]}
                onPress={() => {
                    if (!reward.is_purchased && canAfford) {
                        onPurchase(reward.id);
                    }
                }}
                disabled={!canAfford || reward.is_purchased}
            >
                {reward.is_purchased 
                    ? <Check size={18} color="white" /> 
                    : <ShoppingCart size={18} color="white" />
                }
                <Text style={styles.purchaseButtonText}>
                    {reward.is_purchased ? 'Adquirido' : `${reward.coin_cost}`}
                </Text>
                {!reward.is_purchased && 
                    <Coins size={16} color="white" style={{ marginLeft: 4 }} />
                }
            </TouchableOpacity>
        </View>
    );
};

const BackpackRewardCard = ({ item }) => (
    <View style={styles.backpackCard}>
        <Image source={{ uri: item.image_url }} style={styles.backpackCardImage} />
        <View style={styles.backpackCardInfo}>
            <Text style={styles.backpackCardTitle}>{item.title}</Text>
            <Text style={styles.backpackCardDescription}>{item.description}</Text>
            <TouchableOpacity style={styles.useButton}>
                <Text style={styles.useButtonText}>Usar</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const LeaderboardRow = ({ user, rank }) => (
    <View style={[styles.leaderboardRow, user.isCurrentUser && styles.currentUserRow]}>
        <Text style={styles.leaderboardRank}>{rank}</Text>
        <Avatar url={user.avatar_url} name={user.full_name} style={styles.leaderboardAvatar} textStyle={{fontSize: 14}}/>
        <Text style={styles.leaderboardName}>{user.full_name}{user.isCurrentUser && ' (Você)'}</Text>
        <Text style={styles.leaderboardXp}>{user.xp} XP</Text>
    </View>
);

const LeaderboardList = ({ users }) => (
    <View style={styles.leaderboardContainer}>
        {users.map((user, index) => (
            <LeaderboardRow key={user.id} user={user} rank={index + 1} />
        ))}
    </View>
);

// --- TELA PRINCIPAL ---
export default function GamificationTabScreen() {
    const { userProfile, fetchUserProfile, session } = useUserStore();
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [myRank, setMyRank] = useState<number | null>(null);
    const [missions, setMissions] = useState<Mission[]>([]);
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [permission, requestPermission] = useCameraPermissions();
    const [showScanner, setShowScanner] = useState(false);
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [showBackpack, setShowBackpack] = useState(false);
    const [currentMission, setCurrentMission] = useState<Mission | null>(null);
    const [missionCode, setMissionCode] = useState('');

    const [newLevel, setNewLevel] = useState<number | null>(null);
    const [isLevelUpModalVisible, setIsLevelUpModalVisible] = useState(false);
    const [oldLevel, setOldLevel] = useState<number | null>(null);

    const [lastCompletedMission, setLastCompletedMission] = useState<Mission | null>(null);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    const [activeScoreboardTab, setActiveScoreboardTab] = useState<'my_scores' | 'leaderboard'>('my_scores');
    const [activeMissionTab, setActiveMissionTab] = useState<'available' | 'completed'>('available');


    const fetchData = useCallback(async (showLoader = true) => {
        if (!userProfile?.id) return;
        if (showLoader) setLoading(true);
        try {
            const [leaderboardRes, missionsRes, completedMissionsRes, rewardsRes, userRewardsRes] = await Promise.all([
                supabase.from('leaderboard').select('*').limit(50),
                supabase.from('missions').select('*').eq('is_active', true),
                supabase.from('user_completed_missions').select('mission_id').eq('user_id', userProfile.id),
                supabase.from('rewards').select('*').eq('is_active', true),
                supabase.from('user_rewards').select('reward_id').eq('user_id', userProfile.id)
            ]);

            if (leaderboardRes.error) throw leaderboardRes.error;
            if (missionsRes.error) throw missionsRes.error;
            if (completedMissionsRes.error) throw completedMissionsRes.error;
            if (rewardsRes.error) throw rewardsRes.error;
            if (userRewardsRes.error) throw userRewardsRes.error;

            const rank = leaderboardRes.data.findIndex(u => u.id === userProfile.id) + 1;
            setLeaderboard(leaderboardRes.data || []);
            setMyRank(rank > 0 ? rank : null);

            const completedMissionIds = new Set(completedMissionsRes.data.map(m => m.mission_id));
            setMissions(missionsRes.data.map(m => ({ ...m, is_completed: completedMissionIds.has(m.id) })));
            
            const userRewardIds = new Set(userRewardsRes.data.map(r => r.reward_id));
            setRewards(rewardsRes.data.map(r => ({ ...r, is_purchased: userRewardIds.has(r.id) })));

        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            Alert.alert("Erro de Conexão", "Não foi possível carregar os dados atualizados.");
        } finally {
            if (showLoader) setLoading(false);
        }
    }, [userProfile?.id]);

    useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

    useEffect(() => {
        if (!userProfile?.id) return;

        const missionsListener = supabase.channel('public:user_completed_missions')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_completed_missions', filter: `user_id=eq.${userProfile.id}` },
            (payload) => {
              console.log('Nova missão completada detectada!', payload);
              fetchData(false);
            }
          ).subscribe();

        const profileListener = supabase.channel('public:profiles')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userProfile.id}`},
            (payload) => {
                console.log('Atualização de perfil detectada!', payload);
                fetchUserProfile(session);
            }
        ).subscribe();

        return () => {
            supabase.removeChannel(missionsListener);
            supabase.removeChannel(profileListener);
        }

    }, [userProfile?.id, fetchData, fetchUserProfile, session]);


    const onRefresh = useCallback(async () => { setIsRefreshing(true); await fetchData(); setIsRefreshing(false); }, [fetchData]);

    const handlePurchase = async (rewardId: string) => { 
        const reward = rewards.find(r => r.id === rewardId);
        if (!reward) return;

        Alert.alert(
            "Confirmar Compra",
            `Você tem certeza que deseja comprar "${reward.title}" por ${reward.coin_cost} moedas?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Confirmar",
                    onPress: async () => {
                        setIsSubmitting(true);
                        try {
                            const { data, error } = await supabase.rpc('purchase_reward', { 
                                p_reward_id: rewardId 
                            });

                            if (error || (data && !data.success)) {
                                throw new Error(error?.message || data?.message || "Ocorreu um erro na compra.");
                            }
                            
                            Alert.alert("Sucesso!", `Você adquiriu "${reward.title}"!`);
                            await fetchUserProfile(session);
                            await fetchData();

                        } catch (error: any) {
                            Alert.alert('Falha na Compra', error.message);
                        } finally {
                            setIsSubmitting(false);
                        }
                    }
                }
            ]
        );
    };
    
    const handleMissionAction = async (mission: Mission) => {
        setCurrentMission(mission);
        const missionType = (mission.type || '').trim().toUpperCase();
        
        if (missionType === 'QR_CODE') {
            if (permission?.status === 'granted') { setShowScanner(true); return; }
            const { status } = await requestPermission();
            if (status === 'granted') { setShowScanner(true); } 
            else { Alert.alert("Permissão Necessária", "Você precisa permitir o acesso à câmera para escanear o QR Code.");}
        } else if (missionType === 'CODE') {
            setShowCodeInput(true);
        }
    };

    const closeSuccessModalAndCheckLevelUp = () => {
        setIsSuccessModalVisible(false);
        if (newLevel !== null) {
            setIsLevelUpModalVisible(true);
            setOldLevel(userProfile.level);
            setTimeout(() => {
                setIsLevelUpModalVisible(false);
                setNewLevel(null);
                setOldLevel(null);
            }, 2000);
        }
    }
    
    const handleCompleteMission = async (missionToComplete: Mission | null) => {
        if (!missionToComplete || isSubmitting) {
            console.log('Mission submission blocked', { missionToComplete, isSubmitting });
            return;
        }
        setIsSubmitting(true);
    
        try {
            const { data: functionResponse, error: invokeError } = await supabase.functions.invoke('complete-mission', {
                body: { mission_id: missionToComplete.id }
            });
    
            if (invokeError) {
                throw new Error(invokeError.message || 'Unknown error invoking function');
            }
            if (functionResponse.error) {
                throw new Error(functionResponse.message || 'Mission completion failed on server');
            }
    
            setLastCompletedMission(missionToComplete);
            setIsSuccessModalVisible(true);
            
            const { data: levelUpData, error: levelUpError } = await supabase.rpc('check_and_apply_level_up', {
                p_user_id: userProfile.id
            });
    
            if (levelUpError) {
                console.error('Level up check failed:', levelUpError);
            }
    
            if (levelUpData?.leveled_up) {
                setOldLevel(userProfile.level);
                setNewLevel(levelUpData.new_level);
            }
    
            await Promise.all([
                fetchUserProfile(session),
                fetchData(false)
            ]);
    
        } catch (error: any) {
            console.error('Mission completion error:', error);
            Alert.alert(
                'Erro na Missão',
                error.message || 'Não foi possível completar a missão. Tente novamente.'
            );
        } finally {
            setTimeout(() => {
                setIsSubmitting(false);
                setCurrentMission(null);
            }, 1000);
        }
    };
    
    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setShowScanner(false);
        
        if (currentMission && data === currentMission.completion_data) {
            handleCompleteMission(currentMission);
        } else {
            Alert.alert('QR Code Inválido', 'Este QR Code não corresponde ao da missão selecionada.');
            setCurrentMission(null);
        }
    };

    const handleCodeSubmit = () => {
        setShowCodeInput(false);
        const codeToSubmit = missionCode;
        setMissionCode('');

        if (currentMission && codeToSubmit.trim().toUpperCase() === currentMission.completion_data.trim().toUpperCase()) {
            handleCompleteMission(currentMission);
        } else {
            Alert.alert('Código Inválido', 'O código inserido não está correto para esta missão.');
        }
    };
    
    const closeSuccessModal = () => {
        setIsSuccessModalVisible(false);
        setLastCompletedMission(null);
    }

    if (loading || !permission) {
        return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
    }
    
    const profileWithRank = { ...userProfile, rank: myRank };
    const purchasedRewards = rewards.filter(r => r.is_purchased);

    const availableMissions = missions.filter(m => !m.is_completed);
    const completedMissions = missions.filter(m => m.is_completed);
    
    return (
    <SafeAreaView style={styles.container}>
        <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
            
            <View style={styles.header}>
                <Text style={styles.title}>Scoreboard</Text>
                <TouchableOpacity style={styles.backpackButton} onPress={() => setShowBackpack(true)}>
                    <Backpack size={24} color="#374151" />
                    {purchasedRewards.length > 0 && <View style={styles.backpackBadge}><Text style={styles.backpackBadgeText}>{purchasedRewards.length}</Text></View>}
                </TouchableOpacity>
            </View>

            <View style={styles.segmentedControl}>
                <TouchableOpacity 
                    style={[styles.segment, activeScoreboardTab === 'my_scores' && styles.segmentActive]}
                    onPress={() => setActiveScoreboardTab('my_scores')}
                >
                    <Text style={[styles.segmentText, activeScoreboardTab === 'my_scores' && styles.segmentTextActive]}>Minha Pontuação</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.segment, activeScoreboardTab === 'leaderboard' && styles.segmentActive]}
                    onPress={() => setActiveScoreboardTab('leaderboard')}
                >
                    <Text style={[styles.segmentText, activeScoreboardTab === 'leaderboard' && styles.segmentTextActive]}>Leaderboard</Text>
                </TouchableOpacity>
            </View>

            {activeScoreboardTab === 'my_scores' ? (
                <>
                    <MyScoreCard profile={profileWithRank} />

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Missões</Text>
                        <View style={styles.segmentedControl}>
                            <TouchableOpacity 
                                style={[styles.segment, activeMissionTab === 'available' && styles.segmentActive]}
                                onPress={() => setActiveMissionTab('available')}
                            >
                                <Text style={[styles.segmentText, activeMissionTab === 'available' && styles.segmentTextActive]}>Disponíveis</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.segment, activeMissionTab === 'completed' && styles.segmentActive]}
                                onPress={() => setActiveMissionTab('completed')}
                            >
                                <Text style={[styles.segmentText, activeMissionTab === 'completed' && styles.segmentTextActive]}>Concluídas</Text>
                            </TouchableOpacity>
                        </View>

                        {activeMissionTab === 'available' && (
                            availableMissions.length > 0 ? (
                                availableMissions.map(m => <MissionCard key={m.id} mission={m} onActionPress={handleMissionAction} />)
                            ) : <Text style={styles.noDataText}>Parabéns! Você completou todas as missões.</Text>
                        )}

                        {activeMissionTab === 'completed' && (
                            completedMissions.length > 0 ? (
                                completedMissions.map(m => <MissionCard key={m.id} mission={m} onActionPress={() => {}} />)
                            ) : <Text style={styles.noDataText}>Nenhuma missão concluída ainda.</Text>
                        )}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Loja de Recompensas</Text>
                        <View style={styles.userCoinsContainer}>
                            <Coins size={18} color="#F59E0B" />
                            <Text style={styles.userCoinsText}>Você tem {userProfile?.coins || 0} moedas</Text>
                        </View>
                        {rewards.length > 0 ? (
                        <FlatList
                            data={rewards}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            snapToInterval={CARD_SNAP_INTERVAL}
                            decelerationRate="fast"
                            contentContainerStyle={{
                                paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2 - (CARD_SPACING / 2),
                            }}
                            renderItem={({ item }) => (
                                <RewardCard
                                    reward={item}
                                    userCoins={userProfile?.coins || 0}
                                    onPurchase={handlePurchase}
                                />
                            )}
                        />
                    ) : (
                        <Text style={styles.noDataText}>Nenhuma recompensa na loja no momento.</Text>
                    )}
                </View>
                </>
            ) : (
                <>
                    <LeaderboardList users={leaderboard} />
                </>
            )}
        </ScrollView>

        <Modal visible={showScanner} animationType="slide" onRequestClose={() => {setShowScanner(false); setCurrentMission(null);}}>
            <CameraView onBarcodeScanned={isSubmitting ? undefined : handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
            <TouchableOpacity style={styles.closeModalButton} onPress={() => {setShowScanner(false); setCurrentMission(null);}}><X size={30} color="white" /></TouchableOpacity>
        </Modal>

        <Modal visible={showCodeInput} animationType="fade" transparent={true} onRequestClose={() => {setShowCodeInput(false); setCurrentMission(null);}}>
             <View style={styles.modalOverlay}>
                 <View style={styles.modalContent}>
                     <Text style={styles.modalTitle}>Completar Missão</Text>
                     <Text style={styles.modalSubtitle}>{currentMission?.title}</Text>
                     <TextInput style={styles.codeInput} placeholder="DIGITE O CÓDIGO" value={missionCode} onChangeText={setMissionCode} autoCapitalize="characters" />
                     <TouchableOpacity style={styles.submitButton} onPress={handleCodeSubmit} disabled={isSubmitting}>
                         {isSubmitting ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Confirmar</Text>}
                     </TouchableOpacity>
                      <TouchableOpacity style={styles.cancelButton} onPress={() => { setShowCodeInput(false); setMissionCode(''); setCurrentMission(null); }}>
                         <Text style={styles.cancelText}>Cancelar</Text>
                     </TouchableOpacity>
                 </View>
             </View>
        </Modal>
        
        <Modal visible={showBackpack} animationType="slide" onRequestClose={() => setShowBackpack(false)}>
             <SafeAreaView style={styles.backpackContainer}>
                 <View style={styles.backpackHeader}>
                     <Text style={styles.backpackTitle}>Mochila de Recompensas</Text>
                     <TouchableOpacity onPress={() => setShowBackpack(false)} style={styles.closeButton}>
                         <X size={24} color="#374151" />
                     </TouchableOpacity>
                 </View>
                 <FlatList
                     data={purchasedRewards}
                     keyExtractor={(item) => item.id}
                     renderItem={({ item }) => <BackpackRewardCard item={item} />}
                     contentContainerStyle={styles.backpackList}
                     ListEmptyComponent={
                         <View style={styles.emptyBackpackContainer}>
                             <Gift size={64} color="#CBD5E1" />
                             <Text style={styles.emptyBackpackText}>Sua mochila está vazia.</Text>
                             <Text style={styles.emptyBackpackSubText}>Compre itens na loja para vê-los aqui.</Text>
                         </View>
                     }
                 />
             </SafeAreaView>
        </Modal>

        <Modal visible={isSuccessModalVisible} animationType="fade" transparent={true} onRequestClose={closeSuccessModalAndCheckLevelUp}>
            <View style={styles.modalOverlay}>
                <View style={styles.successModalContent}>
                    <View style={styles.successIconContainer}><Sparkles size={40} color="#FBBF24" /></View>
                    <Text style={styles.successModalTitle}>Missão Concluída!</Text>
                    <Text style={styles.successModalSubtitle}>Você completou "{lastCompletedMission?.title}"</Text>
                    <View style={styles.rewardsContainer}>
                        <View style={styles.rewardItem}><Trophy size={24} color="#10B981" /><Text style={styles.rewardText}>+{lastCompletedMission?.xp_reward} XP</Text></View>
                        <View style={styles.rewardItem}><Coins size={24} color="#F59E0B" /><Text style={styles.rewardText}>+{lastCompletedMission?.coin_reward} Moedas</Text></View>
                    </View>
                    <TouchableOpacity style={styles.successCloseButton} onPress={closeSuccessModalAndCheckLevelUp}>
                        <Text style={styles.successCloseButtonText}>Continuar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

        <AnimatedLevelUpModal 
            visible={isLevelUpModalVisible}
            onClose={() => setIsLevelUpModalVisible(false)}
            oldLevel={oldLevel}
            newLevel={newLevel}
        />
    </SafeAreaView>
);
}

// --- ESTILOS ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#b7e2d4ff', paddingTop: 20, marginBottom: 95 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold' },
    backpackButton: { position: 'absolute', right: 16, top: 12, padding: 8 },
    backpackBadge: { position: 'absolute', top: 2, right: 2, backgroundColor: '#EF4444', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#F8FAFC' },
    backpackBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
    section: { marginHorizontal: 16, marginTop: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    noDataText: { textAlign: 'center', color: '#6B7280', fontStyle: 'italic', paddingVertical: 20, marginTop: 56 },
    userCoinsContainer: { backgroundColor: '#F8FAFC', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16, paddingVertical: 8, backgroundColor: '#FFFBEB', borderRadius: 12, borderColor: '#FEF3C7', borderWidth: 1 },
    userCoinsText: { fontSize: 16, fontWeight: '600', color: '#B45309' },
    rewardCard: { backgroundColor: 'white', borderRadius: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB', width: CARD_WIDTH, marginHorizontal: -28, marginRight: 36  },
    rewardImage: { width: '100%', height: 120 },
    rewardInfo: { padding: 12 },
    rewardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
    rewardDescription: { fontSize: 14, color: '#4B5563', marginTop: 4 },
    purchaseButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 12, paddingVertical: 12, paddingHorizontal: 26, borderRadius: 12, gap: 8, marginTop: 'auto', alignSelf: 'flex-end' },
    purchaseButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    canAffordButton: { backgroundColor: '#10B981' },
    cantAffordButton: { backgroundColor: '#9CA3AF' },
    purchasedButton: { backgroundColor: '#3B82F6' },
    backpackContainer: { flex: 1, backgroundColor: '#F8FAFC' },
    backpackHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    backpackTitle: { fontSize: 20, fontWeight: 'bold' },
    closeButton: { padding: 4 },
    backpackList: { padding: 16 },
    backpackCard: { backgroundColor: 'white', borderRadius: 16, flexDirection: 'row', marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
    backpackCardImage: { width: 100, height: '100%' },
    backpackCardInfo: { flex: 1, padding: 12 },
    backpackCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
    backpackCardDescription: { fontSize: 13, color: '#6B7280', marginTop: 4, flexGrow: 1 },
    useButton: { backgroundColor: '#3B82F6', borderRadius: 10, paddingVertical: 8, alignItems: 'center', marginTop: 8 },
    useButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    emptyBackpackContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: '40%' },
    emptyBackpackText: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginTop: 16 },
    emptyBackpackSubText: { fontSize: 14, color: '#9CA3AF', marginTop: 4, textAlign: 'center', paddingHorizontal: 40 },
    myScoreCard: { backgroundColor: 'white', marginHorizontal: 16, marginTop: 16, borderRadius: 20, padding: 20, alignItems: 'center', elevation: 4 },
    rankBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
    rankText: { color: '#1E40AF', fontWeight: 'bold', fontSize: 12 },
    myAvatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#BFDBFE' },
    myUsername: { fontSize: 20, fontWeight: 'bold', marginTop: 8 },
    xpProgressSection: { width: '100%', marginTop: 12, marginBottom: 20 },
    progressText: { color: '#6B7280', fontSize: 12, textAlign: 'center', marginBottom: 4 },
    progressContainer: { backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden', height: 8 },
    progressBar: { height: '100%', borderRadius: 4 },
    myStatsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
    statBox: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
    statLabel: { color: '#6B7280', fontSize: 12 },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
    modalContent: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: '#1F2937' },
    modalSubtitle: { fontSize: 16, color: '#6B7280', marginBottom: 24, textAlign: 'center' },
    codeInput: { width: '100%', height: 50, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, paddingHorizontal: 16, fontSize: 18, textAlign: 'center', marginBottom: 16, fontWeight: 'bold', color: '#1F2937' },
    submitButton: { width: '100%', backgroundColor: '#3B82F6', padding: 16, borderRadius: 10, alignItems: 'center', minHeight: 54, justifyContent: 'center' },
    submitButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    cancelButton: { marginTop: 8, padding: 8 },
    cancelText: { color: '#6B7280', fontSize: 14 },
    avatarBase: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0E7FF', overflow: 'hidden' },
    avatarImage: { width: '100%', height: '100%' },
    avatarText: { color: '#1E40AF', fontWeight: 'bold', fontSize: 16 },
    closeModalButton: { position: 'absolute', top: 60, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 20 },
    successModalContent: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 24, alignItems: 'center' },
    successIconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#10B98130', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    successModalTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
    successModalSubtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
    rewardsContainer: { width: '100%', marginBottom: 24 },
    rewardItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', padding: 12, borderRadius: 10, marginBottom: 8 },
    rewardText: { fontSize: 16, fontWeight: '600', color: '#374151', marginLeft: 12 },
    successCloseButton: { width: '100%', backgroundColor: '#3B82F6', padding: 16, borderRadius: 10, alignItems: 'center' },
    successCloseButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    levelUpText: { fontSize: 48, fontWeight: 'bold', color: '#3B82F6', marginBottom: 24, textAlign: 'center' },
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: '#E5E7EB',
        borderRadius: 18,
        marginHorizontal: 16,
        marginTop: 16,
        padding: 4,
    },
    segment: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 16,
        alignItems: 'center',
        paddingBottom: 4,
        
    },
    segmentActive: {
        backgroundColor: 'white',
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginHorizontal: 2,
        transform: [{ scale: 1.05 }],

    },
    segmentText: {
        color: '#4B5563',
        fontWeight: '600',
        
    },
    segmentTextActive: {
        color: '#3B82F6',
    },
    leaderboardContainer: {
        marginHorizontal: 16,
        marginTop: 8,
    },
    leaderboardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    currentUserRow: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#3B82F6',
    },
    leaderboardRank: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6B7280',
        width: 30,
    },
    leaderboardAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 12,
    },
    leaderboardName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    leaderboardXp: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#10B981',
    },
    
});
