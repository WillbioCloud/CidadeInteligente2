// src/screens/scheduling/CourtBookingDetailScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ArrowLeft, Users, Zap, Calendar, Clock } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../hooks/useUserStore';

// Dados mocados para datas e horários disponíveis
const DATES = [
  { dayOfWeek: 'Hoje', date: '26/07' },
  { dayOfWeek: 'Amanhã', date: '27/07' },
  { dayOfWeek: 'Seg', date: '29/07' },
  { dayOfWeek: 'Ter', date: '30/07' },
];
const TIME_SLOTS = ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '19:00', '20:00'];

export default function CourtBookingDetailScreen({ route, navigation }) {
  const { court } = route.params;
  const { userProfile } = useUserStore();
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Atenção', 'Por favor, selecione uma data e um horário.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('court_bookings').insert({
      user_id: userProfile?.id,
      court_id: court.id,
      booking_date: new Date().toISOString().split('T')[0], // Em um app real, usaríamos a data selecionada
      booking_time: selectedTime,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Erro', 'Este horário já foi agendado. Por favor, escolha outro.');
    } else {
      Alert.alert('Sucesso!', `Sua reserva na ${court.name} para ${selectedDate.date} às ${selectedTime} foi confirmada.`);
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservar Quadras</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Card de Informações da Quadra */}
        <View style={styles.courtInfoCard}>
            <View style={styles.courtHeader}>
                <Text style={styles.courtName}>{court.name}</Text>
                <View style={styles.typeTag}><Text style={styles.typeTagText}>{court.type}</Text></View>
            </View>
            <View style={styles.detailsRow}>
                <View style={styles.detailItem}><Users size={16} color="#64748B"/><Text style={styles.detailText}>Até {court.capacity} pessoas</Text></View>
                <View style={styles.detailItem}><Zap size={16} color="#64748B"/><Text style={styles.detailText}>Uso gratuito</Text></View>
            </View>
            <Text style={styles.amenitiesTitle}>Comodidades:</Text>
            <View style={styles.amenitiesRow}>
                {court.features.map((f, i) => <Text key={i} style={styles.amenity}>{f}</Text>)}
            </View>
        </View>

        {/* Seletor de Data */}
        <View style={styles.section}>
            <Calendar size={20} color="#334155" />
            <Text style={styles.sectionTitle}>Selecionar Data</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
            {DATES.map(d => (
                <TouchableOpacity key={d.date} style={[styles.dateChip, selectedDate.date === d.date && styles.dateChipSelected]} onPress={() => setSelectedDate(d)}>
                    <Text style={[styles.dateChipDay, selectedDate.date === d.date && styles.dateChipSelectedText]}>{d.dayOfWeek}</Text>
                    <Text style={[styles.dateChipDate, selectedDate.date === d.date && styles.dateChipSelectedText]}>{d.date}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
        
        {/* Seletor de Horário */}
        <View style={styles.section}>
            <Clock size={20} color="#334155" />
            <Text style={styles.sectionTitle}>Horários Disponíveis</Text>
        </View>
        <View style={styles.slotsContainer}>
            {TIME_SLOTS.map(t => (
                <TouchableOpacity key={t} style={[styles.slotChip, selectedTime === t && styles.slotChipSelected]} onPress={() => setSelectedTime(t)}>
                    <Text style={[styles.slotChipText, selectedTime === t && styles.slotChipSelectedText]}>{t}</Text>
                </TouchableOpacity>
            ))}
        </View>
      </ScrollView>

      {/* Botão de Confirmação */}
      <View style={styles.footer}>
          <TouchableOpacity style={[styles.confirmButton, !selectedTime && {backgroundColor: '#D1D5DB'}]} disabled={!selectedTime || loading} onPress={handleConfirmBooking}>
              <Text style={styles.confirmButtonText}>{loading ? 'Agendando...' : 'Confirmar Agendamento'}</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Estilos baseados no novo conceito
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF', paddingBottom: 20 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    backButton: { padding: 8 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    backToCourtsLink: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    backToCourtsText: { color: '#4B5563', fontWeight: '500', marginLeft: 4 },
    courtInfoCard: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 24 },
    courtHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    courtName: { fontSize: 20, fontWeight: 'bold', flex: 1, marginRight: 8 },
    typeTag: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    typeTagText: { color: '#1E40AF', fontWeight: '600', fontSize: 12 },
    detailsRow: { flexDirection: 'row', gap: 24, marginTop: 12 },
    detailItem: { flexDirection: 'row', alignItems: 'center' },
    detailText: { marginLeft: 8, color: '#475569' },
    amenitiesTitle: { color: '#64748B', marginTop: 16, marginBottom: 8 },
    amenitiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    amenity: { backgroundColor: '#F1F5F9', color: '#475569', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 12, overflow: 'hidden' },
    section: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
    dateScroll: { paddingVertical: 16 },
    dateChip: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginRight: 12, alignItems: 'center', minWidth: 70 },
    dateChipSelected: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
    dateChipDay: { color: '#334155', fontWeight: '600' },
    dateChipDate: { color: '#64748B', fontSize: 12 },
    dateChipSelectedText: { color: 'white' },
    slotsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
    slotChip: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, minWidth: '22%', alignItems: 'center' },
    slotChipSelected: { backgroundColor: '#DBEAFE', borderColor: '#60A5FA' },
    slotChipText: { color: '#334155', fontWeight: '500' },
    slotChipSelectedText: { color: '#1E40AF' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
    confirmButton: { backgroundColor: '#3B82F6', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 100, minHeight: 54, marginHorizontal: 16   },
    confirmButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});