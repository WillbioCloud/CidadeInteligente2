// src/components/comercio/CommerceCard.tsx (VERSÃO UNIFICADA E OTIMIZADA)

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Star, Phone, Instagram, MapPin } from '../Icons'; // Usando os ícones corretos

const FALLBACK_IMAGE_URL = 'https://i.imgur.com/gJaIjmW.png';

export default function CommerceCard({ commerce }) {
    const navigation = useNavigation();

    // Se o objeto 'commerce' for inválido, não renderiza nada para evitar erros.
    if (!commerce || !commerce.id) {
        return null;
    }

    // --- FUNÇÕES DE AÇÃO SEGURAS ---
    const handleCall = (e) => {
        e.stopPropagation(); // Impede que o clique no botão navegue para os detalhes
        const phone = commerce.contact?.whatsapp;
        if (phone) {
            Linking.openURL(`tel:${phone}`).catch(() => {
                Alert.alert("Erro", "Não foi possível abrir o aplicativo de ligação.");
            });
        } else {
            Alert.alert("Indisponível", "Este comércio não possui um número de telefone cadastrado.");
        }
    };

    const handleInstagram = (e) => {
        e.stopPropagation(); // Impede que o clique no botão navegue para os detalhes
        const username = commerce.contact?.instagram;
        if (username) {
            const cleanUsername = username.replace('@', '');
            Linking.openURL(`https://instagram.com/${cleanUsername}`).catch(() => {
                Alert.alert("Erro", "Não foi possível abrir o Instagram.");
            });
        } else {
            Alert.alert("Indisponível", "Este comércio não possui Instagram cadastrado.");
        }
    };
    
    const handleNavigation = () => {
        // Navega para a tela de detalhes, passando o objeto completo
        // @ts-ignore
        navigation.navigate('CommerceDetail', { commerce: commerce });
    };

    // --- VERIFICAÇÕES DE SEGURANÇA PARA OS DADOS ---
    const coverImage = commerce.coverImage || FALLBACK_IMAGE_URL;

    return (
        // O card inteiro é clicável para navegar para os detalhes
        <TouchableOpacity 
            style={styles.card}
            activeOpacity={0.9}
            onPress={handleNavigation}
        >
            {/* Seção da Imagem com Tags */}
            <View>
                <Image 
                    source={{ uri: coverImage }} 
                    style={styles.cardImage} 
                    defaultSource={{ uri: FALLBACK_IMAGE_URL }}
                />
                <View style={[styles.tag, styles.categoryTag]}>
                    <Text style={styles.tagText}>{commerce.category}</Text>
                </View>
                {commerce.featured && (
                    <View style={[styles.tag, styles.featuredTag]}>
                        <Star size={12} color="#1C1C1E" />
                        <Text style={[styles.tagText, { color: '#1C1C1E' }]}>Destaque</Text>
                    </View>
                )}
            </View>

            {/* Seção de Conteúdo */}
            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>{commerce.name}</Text>
                
                <View style={styles.infoRow}>
                    <Star size={16} color="#F59E0B" />
                    <Text style={styles.rating}>{commerce.rating}</Text>
                    <View style={styles.dot} />
                    <MapPin size={16} color="#6B7280" />
                    <Text style={styles.locationText} numberOfLines={1}>{commerce.loteamento_id.replace('_', ' ')}</Text>
                </View>

                <Text style={styles.description} numberOfLines={2}>{commerce.description}</Text>
                
                {/* Botões de Ação */}
                <View style={styles.buttonRow}>
                    {commerce.contact?.whatsapp && (
                        <TouchableOpacity style={styles.buttonPrimary} onPress={handleCall}>
                            <Phone size={16} color="white" />
                            <Text style={styles.buttonPrimaryText}>Ligar</Text>
                        </TouchableOpacity>
                    )}
                    {commerce.contact?.instagram && (
                        <TouchableOpacity style={styles.buttonSecondary} onPress={handleInstagram}>
                            <Instagram size={16} color="#374151" />
                            <Text style={styles.buttonSecondaryText}>Instagram</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

// --- ESTILOS UNIFICADOS (MELHOR DE AMBOS) ---
const styles = StyleSheet.create({
    card: { 
        backgroundColor: 'white', 
        borderRadius: 16, 
        marginBottom: 16, 
        elevation: 4, 
        shadowColor: '#4F46E5', 
        shadowOpacity: 0.1, 
        shadowRadius: 10, 
        shadowOffset: { width: 0, height: 4 } 
    },
    cardImage: { 
        width: '100%', 
        height: 160, 
        borderTopLeftRadius: 16, 
        borderTopRightRadius: 16,
        backgroundColor: '#F3F4F6'
    },
    tag: { 
        position: 'absolute', 
        top: 12, 
        paddingVertical: 4, 
        paddingHorizontal: 10, 
        borderRadius: 12, 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    categoryTag: { 
        left: 12, 
        backgroundColor: 'rgba(0,0,0,0.5)' 
    },
    featuredTag: { 
        right: 12, 
        backgroundColor: '#FBBF24', // Cor mais vibrante para destaque
    },
    tagText: { 
        color: 'white', 
        fontSize: 12, 
        fontWeight: 'bold', 
        marginLeft: 4 
    },
    content: { 
        padding: 16 
    },
    name: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 8,
        color: '#111827'
    },
    infoRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 12,
        flexWrap: 'wrap' // Permite que a linha quebre se necessário
    },
    rating: { 
        marginLeft: 4, 
        fontWeight: 'bold', 
        color: '#374151' 
    },
    dot: {
        width: 4,
        height: 4,
        backgroundColor: '#D1D5DB',
        borderRadius: 2,
        marginHorizontal: 8,
    },
    locationText: { 
        marginLeft: 4, 
        color: '#6B7280',
        flexShrink: 1 // Permite que o texto encolha se não houver espaço
    },
    description: { 
        color: '#4B5563', 
        marginVertical: 4, 
        lineHeight: 20,
        minHeight: 40 // Garante altura mesmo com descrição curta
    },
    buttonRow: { 
        flexDirection: 'row', 
        marginTop: 12, 
        gap: 12 
    },
    buttonPrimary: { 
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#4F46E5', 
        paddingVertical: 12, 
        borderRadius: 8 
    },
    buttonPrimaryText: { 
        color: 'white', 
        fontWeight: 'bold', 
        marginLeft: 8,
        fontSize: 14,
    },
    buttonSecondary: { 
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#F3F4F6', 
        paddingVertical: 12, 
        borderRadius: 8, 
        borderWidth: 1, 
        borderColor: '#E5E7EB' 
    },
    buttonSecondaryText: { 
        color: '#374151', 
        fontWeight: 'bold', 
        marginLeft: 8,
        fontSize: 14,
    },
});