// src/screens/Transport/TransportTabScreen.tsx (VERSÃO FINAL COM ANIMAÇÃO DE TOQUE E VIBRAÇÃO)

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, Modal } from 'react-native';
import { ArrowLeft, Bus, Clock } from '../../components/Icons';
import { fetchBusSchedules, BusSchedule } from '../../api/transportApi';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics'; // Importando a biblioteca de vibração

const TRAVEL_TIME_MINUTES = 45;
const APPROACH_TIME_MINUTES = 60;

// --- COMPONENTES AUXILIARES ---

const ClockCard = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);
    return (
        <View style={styles.clockContainer}><Clock size={16} color="#E0E7FF" /><Text style={styles.clockText}>{time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text></View>
    );
};

const BusDetailModal = ({ visible, onClose, departure }) => {
  const progress = useSharedValue(0);
  const trackWidth = useSharedValue(0); 

  const animatedProgressStyle = useAnimatedStyle(() => ({ width: progress.value >= 0 ? `${progress.value}%` : '0%' }));
  
  const animatedBusStyle = useAnimatedStyle(() => {
    if (trackWidth.value === 0) return {};
    let positionPercentage = progress.value < 0 ? 100 + progress.value : progress.value;
    const position = (positionPercentage / 100) * (trackWidth.value - 20);
    return { transform: [{ translateX: position }] };
  });

  useEffect(() => {
    let animationInterval;
    const updateAnimation = () => {
      if (!departure) return;
      const now = new Date();
      const { departureTime, arrivalTime, approachStartTime } = departure.times;
      let currentProgress = now < approachStartTime ? -101 : (now >= arrivalTime ? 101 : (now < departureTime ? ((now - approachStartTime) / (departureTime - approachStartTime) * 100 - 100) : ((now - departureTime) / (arrivalTime - departureTime) * 100)));
      progress.value = withTiming(currentProgress, { duration: 1000, easing: Easing.linear });
    };
    if (visible) {
      setTimeout(() => {
        updateAnimation();
        animationInterval = setInterval(updateAnimation, 5000);
      }, 100);
    }
    return () => clearInterval(animationInterval);
  }, [visible, departure]);

  if (!departure) return null;
  const { arrivalTimeString } = departure;

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
          <Text style={styles.modalTitle}>{departure.line_name}</Text>
          <Text style={styles.modalLineCode}>Linha: {departure.line_code}</Text>
          <View style={styles.animationContainer}>
            <View style={styles.animationEndpoints}><Text style={styles.animationText}>{departure.point_a}</Text><Text style={styles.animationText}>{departure.point_b}</Text></View>
            <View style={styles.animationTrack} onLayout={(e) => { trackWidth.value = e.nativeEvent.layout.width; }}>
              <Animated.View style={[styles.animationProgress, animatedProgressStyle]} />
              <Animated.View style={[styles.busIcon, animatedBusStyle]}><Bus size={20} color="white" /></Animated.View>
            </View>
            <View style={styles.animationEndpoints}><Text style={styles.animationTime}>{departure.time}</Text><Text style={styles.animationTime}>{arrivalTimeString}</Text></View>
          </View>
          <Text style={styles.modalInfo}>Esta é uma simulação em tempo real da posição do ônibus.</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// --- CARD DE PARTIDA COM ANIMAÇÃO DE TOQUE ---
const DepartureCard = React.memo(({ departure, onLongPress }) => {
    const { arrivalTimeString, status } = departure;
    const scale = useSharedValue(1); // Valor compartilhado para a animação de escala

    const statusInfo = {
        approaching: { C: '#FFFBEB', T: '#B45309', B: '#FBBF24', label: 'Aproximando' },
        in_transit: { C: '#F0FDF4', T: '#15803D', B: '#4ADE80', label: 'Em trânsito' },
        finished: { C: '#F8FAFC', T: '#64748B', B: '#E2E8F0', label: 'Finalizado' },
        waiting: { C: '#FFFFFF', T: '#4B5563', B: '#E5E7EB', label: 'Aguardando' },
    };
    const style = statusInfo[status] || statusInfo.waiting;
    
    // Estilo animado que aplica a transformação de escala
    const animatedCardStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    // Funções para controlar a animação ao pressionar
    const onPressIn = () => { scale.value = withSpring(1.03); };
    const onPressOut = () => { scale.value = withSpring(1); };

    return (
        <TouchableOpacity 
            activeOpacity={0.9} 
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onLongPress={onLongPress}
            delayLongPress={200} // Pequeno delay para o long press
        >
            <Animated.View style={[styles.card, { backgroundColor: style.C }, animatedCardStyle]}>
                <View style={styles.statusIndicator(style.B)} />
                <View style={styles.cardHeader}><Text style={styles.lineName} numberOfLines={1}>{departure.line_name} ({departure.line_code})</Text><Text style={[styles.statusText, {color: style.T}]}>{style.label}</Text></View>
                <View style={styles.cardBody}>
                    <View style={styles.timePoint_a}><Text style={styles.time}>{departure.time}</Text><Text style={styles.location} numberOfLines={1}>{departure.point_a}</Text></View>
                    <View style={styles.durationContainer}><View style={styles.dotLine} /><Text style={styles.durationText}>{TRAVEL_TIME_MINUTES} min</Text><Bus size={16} color="#9CA3AF" /><View style={styles.dotLine} /></View>
                    <View style={styles.timePoint_b}><Text style={styles.time}>{arrivalTimeString}</Text><Text style={styles.location} numberOfLines={1}>{departure.point_b}</Text></View>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
});

// --- TELA PRINCIPAL ---
export default function TransportTabScreen({ navigation }) {
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  // --- ALTERAÇÃO AQUI: Adicionando a vibração ---
  const handleLongPress = (departure) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Vibração média
    setSelectedDeparture(departure);
    setModalVisible(true);
  };

  useEffect(() => {
    const loadSchedules = async () => {
      setLoading(true);
      const data = await fetchBusSchedules();
      setSchedules(data);
      setLoading(false);
    };
    loadSchedules();
  }, []);

  const allDepartures = useMemo(() => {
    const departures = [];
    const dayOfWeek = currentTime.getDay(); 
    schedules.forEach(line => {
      let timeString = '';
      if (dayOfWeek === 0) timeString = line.times_sunday;
      else if (dayOfWeek === 6) timeString = line.times_saturday;
      else timeString = line.times_weekdays;

      if (timeString && timeString !== 'Não informado' && timeString !== 'Não operacional') {
        const times = timeString.match(/\b\d{2}:\d{2}\b/g) || [];
        times.forEach(timeStr => {
          const [hour, minute] = timeStr.trim().split(':').map(Number);
          if(isNaN(hour) || isNaN(minute)) return;
          const departureTime = new Date(currentTime);
          departureTime.setHours(hour, minute, 0, 0);
          const arrivalTime = new Date(departureTime.getTime() + TRAVEL_TIME_MINUTES * 60000);
          const approachStartTime = new Date(departureTime.getTime() - APPROACH_TIME_MINUTES * 60000);
          let status = currentTime >= arrivalTime ? 'finished' : (currentTime >= departureTime ? 'in_transit' : (currentTime >= approachStartTime ? 'approaching' : 'waiting'));
          const arrivalTimeString = `${arrivalTime.getHours().toString().padStart(2, '0')}:${arrivalTime.getMinutes().toString().padStart(2, '0')}`;
          departures.push({ id: `${line.id}-${timeStr}`, time: timeStr.trim(), ...line, arrivalTimeString, status, times: { departureTime, arrivalTime, approachStartTime } });
        });
      }
    });
    return departures.sort((a, b) => {
      const statusOrder = { approaching: 1, in_transit: 2, waiting: 3, finished: 4 };
      if (statusOrder[a.status] !== statusOrder[b.status]) return statusOrder[a.status] - statusOrder[b.status];
      return a.times.departureTime - b.times.departureTime;
    });
  }, [schedules, currentTime]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}><TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><ArrowLeft size={24} color="#FFF" /></TouchableOpacity><View><Text style={styles.headerTitle}>Transporte Público</Text><Text style={styles.headerSubtitle}>Próximas partidas</Text></View><ClockCard /></View>
      <View style={styles.filterBar}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}><TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}><Text style={[styles.filterText, styles.filterTextActive]}>Todos</Text></TouchableOpacity><TouchableOpacity style={styles.filterChip}><Text style={styles.filterText}>Brasília</Text></TouchableOpacity><TouchableOpacity style={styles.filterChip}><Text style={styles.filterText}>Taguatinga</Text></TouchableOpacity></ScrollView></View>
      
      {loading ? (<ActivityIndicator size="large" color="#4F46E5" style={{ flex: 1 }} />) : (
        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>
          {allDepartures.length > 0 ? (
            allDepartures.map((departure, index) => (
              <DepartureCard key={`${departure.id}-${index}`} departure={departure} onLongPress={() => handleLongPress(departure)} />
            ))
          ) : (<Text style={styles.emptyText}>Nenhum próximo ônibus foi encontrado para hoje.</Text>)}
        </ScrollView>
      )}

      <BusDetailModal visible={isModalVisible} onClose={() => setModalVisible(false)} departure={selectedDeparture} />
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#4F46E5', paddingTop: 10, paddingHorizontal: 20, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  headerSubtitle: { fontSize: 13, color: '#E0E7FF', textAlign: 'center', marginTop: 2 },
  clockContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  clockText: { color: 'white', fontWeight: 'bold', marginLeft: 6 },
  filterBar: { backgroundColor: '#F3F4F6', paddingVertical: 12 },
  filtersContainer: { paddingHorizontal: 16, gap: 8 },
  filterChip: { backgroundColor: 'white', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  filterChipActive: { backgroundColor: '#4338CA', borderColor: '#4338CA' },
  filterText: { fontWeight: '600', color: '#4B5563' },
  filterTextActive: { color: 'white' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  card: { borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'transparent', overflow: 'hidden' }, // Removida borda padrão
  statusIndicator: (color) => ({ position: 'absolute', top: 0, left: 0, bottom: 0, width: 6, backgroundColor: color }),
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', marginLeft: 10 },
  lineName: { fontSize: 15, fontWeight: 'bold', color: '#111827', flex: 1, marginRight: 8 },
  statusText: { fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' },
  cardBody: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 10 },
  timePoint_a: { alignItems: 'flex-start', flex: 1 },
  timePoint_b: { alignItems: 'flex-end', flex: 1 },
  time: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  location: { fontSize: 13, color: '#6B7280' },
  durationContainer: { alignItems: 'center', marginHorizontal: 10 },
  dotLine: { width: 1, height: 8, backgroundColor: '#D1D5DB' },
  durationText: { fontSize: 12, color: '#6B7280', marginVertical: 4 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#6B7280', fontSize: 16, paddingHorizontal: 20, lineHeight: 24 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 24, width: '100%', elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'center' },
  modalLineCode: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
  animationContainer: { marginBottom: 20 },
  animationEndpoints: { flexDirection: 'row', justifyContent: 'space-between' },
  animationText: { fontSize: 12, color: '#4B5563', fontWeight: '500' },
  animationTime: { fontSize: 14, color: '#111827', fontWeight: 'bold' },
  animationTrack: { height: 10, width: '100%', backgroundColor: '#E5E7EB', borderRadius: 5, marginVertical: 4, justifyContent: 'center' },
  animationProgress: { height: '100%', backgroundColor: '#4F46E5', borderRadius: 5 },
  busIcon: { position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: '#4338CA', justifyContent: 'center', alignItems: 'center' },
  modalInfo: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', fontStyle: 'italic', marginTop: 16 }
});