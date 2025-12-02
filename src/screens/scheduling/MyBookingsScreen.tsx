// src/screens/scheduling/MyBookingsScreen.tsx (VERSÃO COM EXCLUSÃO)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft, Calendar, Clock, Trash2 } from 'lucide-react-native'; // Adicionado o ícone de lixeira
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../hooks/useUserStore';

// O componente do Card agora recebe a função para deletar
const BookingCard = ({ booking, onDelete }) => (
    <View style={styles.card}>
        <View>
            <Text style={styles.cardCourtName}>{booking.courts.name}</Text>
            <View style={styles.cardRow}>
                <Calendar size={16} color="#4B5563" />
                <Text style={styles.cardText}>{new Date(booking.booking_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Text>
            </View>
            <View style={styles.cardRow}>
                <Clock size={16} color="#4B5563" />
                <Text style={styles.cardText}>{booking.booking_time}</Text>
            </View>
        </View>
        
        {/* --- BOTÃO DE EXCLUIR ADICIONADO --- */}
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(booking.id)}>
            <Trash2 size={20} color="#EF4444" />
        </TouchableOpacity>
    </View>
);

export default function MyBookingsScreen({ navigation }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userProfile } = useUserStore();

    const fetchBookings = async () => {
        if (!userProfile?.id) {
            setLoading(false);
            return;
        }
        setLoading(true);
        const { data, error } = await supabase
            .from('court_bookings')
            .select('*, courts(name)')
            .eq('user_id', userProfile.id)
            .order('booking_date', { ascending: true }); // Ordena do mais antigo para o mais novo
        
        if (error) {
            console.error("Erro ao buscar agendamentos:", error);
            Alert.alert("Erro", "Não foi possível carregar seus agendamentos.");
        } else {
            setBookings(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, [userProfile]);

    // --- FUNÇÃO PARA DELETAR O AGENDAMENTO ---
    const handleDeleteBooking = (bookingId) => {
        Alert.alert(
            "Cancelar Agendamento",
            "Você tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.",
            [
                { text: "Não", style: "cancel" },
                { 
                    text: "Sim, cancelar", 
                    style: "destructive", 
                    onPress: async () => {
                        // 1. Deleta do banco de dados
                        const { error } = await supabase
                            .from('court_bookings')
                            .delete()
                            .eq('id', bookingId);
                        
                        if (error) {
                            Alert.alert("Erro", "Não foi possível cancelar o agendamento.");
                            console.error("Erro ao deletar:", error);
                        } else {
                            // 2. Remove da lista na tela para atualização instantânea
                            setBookings(prevBookings => prevBookings.filter(b => b.id !== bookingId));
                            Alert.alert("Sucesso", "Agendamento cancelado.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Meus Agendamentos</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#339949ff" style={{ flex: 1 }} />
            ) : (
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <BookingCard booking={item} onDelete={handleDeleteBooking} />}
                    contentContainerStyle={{ padding: 16 }}
                    ListEmptyComponent={<Text style={styles.emptyText}>Você ainda não possui agendamentos.</Text>}
                    onRefresh={fetchBookings} // Permite puxar para atualizar
                    refreshing={loading}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    backButton: { padding: 8 },
    card: { 
        backgroundColor: 'white', 
        padding: 16, 
        borderRadius: 12, 
        marginBottom: 12, 
        borderWidth: 1, 
        borderColor: '#F1F5F9',
        flexDirection: 'row', // Para alinhar o conteúdo com o botão
        justifyContent: 'space-between', // Espaça o conteúdo e o botão
        alignItems: 'center', // Alinha verticalmente
    },
    cardCourtName: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    cardText: { marginLeft: 8, fontSize: 16, color: '#334155' },
    deleteButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#FEE2E2',
    },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#64748B' },
});