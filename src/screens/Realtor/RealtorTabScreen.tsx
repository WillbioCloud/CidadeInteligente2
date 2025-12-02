import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLoteamentos } from '../../hooks/useUserStore';

// Componente reutilizável para os botões do painel
const DashboardButton = ({ icon, title, description, onPress, theme, disabled = false }) => (
    <TouchableOpacity style={[styles.button, disabled && styles.buttonDisabled]} onPress={onPress} disabled={disabled}>
        <View style={[styles.iconContainer, { backgroundColor: theme.light }]}>
            <Ionicons name={icon} size={28} color={theme.primary} />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.buttonTitle}>{title}</Text>
            <Text style={styles.buttonDescription}>{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
    </TouchableOpacity>
);

export default function RealtorTabScreen() {
    const { userProfile, getThemeColors } = useLoteamentos();
    const theme = getThemeColors();

    const isFbzRealtor = userProfile?.user_type === 'corretor_fbz';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.title}>Área do Corretor</Text>
                    <Text style={styles.subtitle}>{isFbzRealtor ? 'Acesso Total (FBZ)' : 'Acesso Parceiro'}</Text>
                </View>

                {/* Seção de Ferramentas */}
                <View style={styles.section}>
                    {/* Botão de Estoque - Visível apenas para corretores FBZ */}
                    {isFbzRealtor && (
                        <DashboardButton
                            icon="file-tray-stacked-outline"
                            title="Estoque de Lotes"
                            description="Visualize todos os lotes e status em tempo real"
                            onPress={() => alert('Abrir tela de estoque')}
                            theme={theme}
                        />
                    )}

                    <DashboardButton
                        icon="people-outline"
                        title="Meus Clientes"
                        description="Veja os clientes vinculados a você"
                        onPress={() => alert('Abrir lista de clientes')}
                        theme={theme}
                    />

                    <DashboardButton
                        icon="folder-open-outline"
                        title="Materiais de Venda"
                        description="Acesse flyers, vídeos e apresentações"
                        onPress={() => alert('Abrir materiais')}
                        theme={theme}
                    />

                     <DashboardButton
                        icon="analytics-outline"
                        title="Minha Performance"
                        description="Acompanhe seus resultados e metas"
                        onPress={() => alert('Abrir Analytics')}
                        theme={theme}
                    />
                </View>

                {/* Seção de Compartilhamento */}
                 <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Link de Indicação</Text>
                     <DashboardButton
                        icon="qr-code-outline"
                        title="Compartilhar meu Link"
                        description="Envie para um novo cliente se cadastrar com você"
                        onPress={() => alert('Gerar link/QR Code')}
                        theme={theme}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
    subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
    section: { marginTop: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', paddingHorizontal: 20, marginBottom: 8 },
    button: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F3F4F6' },
    buttonDisabled: { opacity: 0.5 },
    iconContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    textContainer: { flex: 1, marginLeft: 16 },
    buttonTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
    buttonDescription: { fontSize: 14, color: '#6B7280', marginTop: 2 }
});