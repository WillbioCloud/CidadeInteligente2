// src/components/layout/NotificationsModal.tsx

import React, { useState, useCallback, useEffect, useMemo, forwardRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SectionList, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../hooks/useUserStore';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { Bell, Zap, Store, Newspaper, Gift, ArrowUpCircle, Sparkles } from 'lucide-react-native';

// ... (As interfaces Notification e RootStackParamList permanecem as mesmas)
interface Notification {
  id: string;
  type: 'lote_disponivel' | 'novidade_feed' | 'nova_missao' | 'workshop' | 'novo_comercio' | 'app_update' | 'novidade_comercio';
  title: string;
  message: string;
  metadata: { [key: string]: any };
  is_read: boolean;
  created_at: string;
}
type RootStackParamList = {
    Home: { screen: string, params?: { scrollToEnd?: boolean } };
    Comercios: { screen: string, params: { commerceId: string } };
    Gamificacao: undefined;
};


const NotificationCard = ({ item, onClose }: { item: Notification, onClose: () => void }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'nova_missao': return { Icon: Zap, color: '#8B5CF6' };
      case 'novo_comercio': return { Icon: Store, color: '#10B981' };
      case 'novidade_comercio': return { Icon: Sparkles, color: '#10B981' };
      case 'novidade_feed': return { Icon: Newspaper, color: '#3B82F6' };
      case 'lote_disponivel': return { Icon: Gift, color: '#F59E0B' };
      case 'app_update': return { Icon: ArrowUpCircle, color: '#EF4444' };
      default: return { Icon: Bell, color: '#6B7280' };
    }
  };

  const handlePress = () => {
    onClose(); // Fecha o bottom sheet
    setTimeout(() => {
      // Lógica de navegação
      switch (item.type) {
        case 'novo_comercio':
        case 'novidade_comercio':
          if (item.metadata?.commerce_id) {
            navigation.navigate('Comercios', {
              screen: 'CommerceDetail',
              params: { commerceId: item.metadata.commerce_id },
            });
          }
          break;
        case 'novidade_feed':
          navigation.navigate('Home', { screen: 'HomeTab', params: { scrollToEnd: true } });
          break;
        case 'nova_missao':
          navigation.navigate('Gamificacao');
          break;
        default:
          navigation.navigate('Home', { screen: 'HomeTab' });
          break;
      }
    }, 250);
  };

  const { Icon, color } = getNotificationStyle(item.type);

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}1A` }]}>
        <Icon size={24} color={color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardMessage} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.cardTime}>{formatTimeAgo(item.created_at)}</Text>
      </View>
      {!item.is_read && <View style={[styles.unreadDot, { backgroundColor: color }]} />}
    </TouchableOpacity>
  );
};

const NotificationsModal = forwardRef((props, ref) => {
  const { userProfile } = useUserStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const snapPoints = useMemo(() => ['50%', '85%'], []);

  const markNotificationsAsRead = useCallback(async () => {
    if (!userProfile?.id) return;
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .or(`user_id.eq.${userProfile.id},user_id.is.null`)
      .eq('is_read', false);
    if (error) console.error("Erro ao marcar notificações como lidas:", error);
  }, [userProfile?.id]);

  const fetchNotifications = useCallback(async () => {
    if (!userProfile?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`user_id.eq.${userProfile.id},user_id.is.null`)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) console.error('Erro ao buscar notificações:', error);
    else setNotifications(data || []);
    setLoading(false);
  }, [userProfile?.id]);

  const handleSheetChanges = useCallback((index: number) => {
    // Quando o bottom sheet é aberto (index > -1), busca as notificações e marca como lidas
    if (index > -1) {
      fetchNotifications();
      markNotificationsAsRead();
    }
  }, [fetchNotifications, markNotificationsAsRead]);

  // Lógica de limpeza de notificações antigas
  useEffect(() => {
    const cleanup = async () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { error } = await supabase
            .from('notifications')
            .delete()
            .lt('created_at', thirtyDaysAgo.toISOString());
        if (error) console.error("Erro ao limpar notificações antigas:", error);
        else console.log("Notificações antigas foram limpas.");
    };
    cleanup();
  }, []);

  const groupedNotifications = notifications.reduce((acc, notif) => {
      const today = new Date();
      const notifDate = new Date(notif.created_at);
      let title = (today.toDateString() === notifDate.toDateString()) 
          ? 'Hoje' 
          : notifDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
      if(!acc[title]) acc[title] = [];
      acc[title].push(notif);
      return acc;
  }, {});

  const sections = Object.keys(groupedNotifications).map(title => ({
      title,
      data: groupedNotifications[title]
  }));

  return (
    <BottomSheetModal
      ref={ref}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backgroundStyle={styles.modalBackground}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.header}>
            <View style={styles.grabber} />
            <Text style={styles.title}>Notificações</Text>
        </View>
        
        {loading ? (
            <ActivityIndicator style={{flex: 1}} size="large" />
        ) : (
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <NotificationCard item={item} onClose={() => ref.current?.dismiss()} />}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                contentContainerStyle={styles.scrollContainer}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma notificação por aqui.</Text>}
            />
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default NotificationsModal;

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
    },
    modalBackground: {
        backgroundColor: '#F8FAFC',
    },
    header: { 
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1, 
        borderBottomColor: '#F1F5F9' 
    },
    grabber: {
        width: 40,
        height: 5,
        backgroundColor: '#CBD5E1',
        borderRadius: 2.5,
        marginBottom: 10,
    },
    title: { 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    scrollContainer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 30 },
    sectionHeader: { fontSize: 14, fontWeight: '600', color: '#64748B', textTransform: 'uppercase', marginBottom: 8, marginTop: 16 },
    card: { 
        backgroundColor: '#FFF', 
        borderRadius: 12, 
        padding: 12, 
        marginBottom: 12, 
        borderWidth: 1, 
        borderColor: '#F1F5F9',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    textContainer: { flex: 1 },
    cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
    cardMessage: { fontSize: 14, color: '#475569', marginTop: 2, lineHeight: 20 },
    cardTime: { fontSize: 12, color: '#94A3B8', marginTop: 6 },
    unreadDot: { width: 10, height: 10, borderRadius: 5, marginLeft: 8, alignSelf: 'center' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#6B7280' },
});
