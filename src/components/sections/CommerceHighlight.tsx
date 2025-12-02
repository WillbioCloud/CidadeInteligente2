// src/components/sections/CommerceHighlight.tsx (VERSÃO FINAL COM LOOP INFINITO REAL)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useUserStore } from '../../hooks/useUserStore';
import { ChevronRight } from '../Icons';
import { supabase } from '../../lib/supabase';
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';

// --- LÓGICA DE DIMENSÕES E ANIMAÇÃO ---
const { width: SRC_WIDTH } = Dimensions.get('window');
const CARD_LENGTH = SRC_WIDTH * 0.7; // Card principal ocupa 70% da tela
const SPACING = SRC_WIDTH * 0.05;    // Espaçamento entre os cards
const SIDECARD_LENGTH = (SRC_WIDTH - CARD_LENGTH) / 2; // Espaço nas laterais para centralizar
const ITEM_FULL_WIDTH = CARD_LENGTH + SPACING;

const SLIDE_INTERVAL = 4000;

// --- COMPONENTE DO CARD ANIMADO ---
const AnimatedCommerceCard = ({ item, index, scrollX }) => {
    const navigation = useNavigation();

    const cardStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 1) * ITEM_FULL_WIDTH,
            index * ITEM_FULL_WIDTH,
            (index + 1) * ITEM_FULL_WIDTH,
        ];

        const scale = interpolate(
            scrollX.value,
            inputRange,
            [0.85, 1, 0.85], // Escala: 85% para os laterais, 100% para o central
            Extrapolate.CLAMP
        );

        return {
            transform: [{ scale }],
        };
    });

    return (
        <Animated.View style={[styles.cardContainer, cardStyle]}>
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('CommerceDetail', { commerce: item })}
            >
              <Image source={{ uri: item.coverImage }} style={styles.cardImage} />
              <View style={styles.badge}><Text style={styles.badgeText}>{item.category}</Text></View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
              </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export const CommerceHighlight = () => {
    const { userProfile } = useUserStore();
    const navigation = useNavigation();
    
    const [commerces, setCommerces] = useState([]);
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef<any>(null);
    const scrollX = useSharedValue(0);
    const currentIndex = useRef(1); // Inicia no primeiro item real

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    useEffect(() => {
        const fetchFeatured = async () => {
            const { data, error } = await supabase.from('comercios').select('*').eq('ativo', true);
            if (!error && data && data.length > 0) {
                const formattedData = data.map(c => ({
                  id: c.id, name: c.nome, category: c.categoria, description: c.descricao,
                  coverImage: c.capa_url, logo: c.logo_url, images: c.galeria_urls || [], services: c.servicos || [],
                  openingHours: c.horario_func?.display_text || 'Não informado', contact: { whatsapp: c.whatsapp, instagram: c.instagram },
                  loteamento_id: c.loteamento_id || 'Cidade_Inteligente', city: c.city || 'S. A. do Descoberto - GO',
                  rating: c.rating || 4.5, featured: c.featured || false, layout_template: c.layout_template || 'moderno',
                }));

                // --- ESTRUTURA PARA O LOOP INFINITO REAL ---
                if (formattedData.length > 1) {
                    const lastItem = formattedData[formattedData.length - 1];
                    const firstItem = formattedData[0];
                    setCommerces([lastItem, ...formattedData, firstItem]);
                } else {
                    setCommerces(formattedData);
                }
            } else if (error) {
                console.error("Erro ao buscar destaques:", error);
            }
            setLoading(false);
        };
        fetchFeatured();
    }, []);

    // Carrossel automático
    useFocusEffect(
        useCallback(() => {
            if (commerces.length > 1 && !loading) {
                const interval = setInterval(() => {
                    currentIndex.current += 1;
                    flatListRef.current?.scrollToIndex({
                        index: currentIndex.current,
                        animated: true,
                    });
                }, SLIDE_INTERVAL);
                return () => clearInterval(interval);
            }
        }, [commerces, loading])
    );
    
    // Lógica para o "salto" invisível que cria o loop
    const handleScrollEnd = useCallback(({ nativeEvent }) => {
        if (commerces.length <= 1) return;
        const originalLength = commerces.length - 2;
        const offsetX = nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / ITEM_FULL_WIDTH);

        currentIndex.current = newIndex;
        
        // Se o usuário rolou para o item "falso" no início (clone do último)
        if (newIndex === 0) {
            flatListRef.current?.scrollToOffset({
                offset: originalLength * ITEM_FULL_WIDTH,
                animated: false,
            });
            currentIndex.current = originalLength;
        } 
        // Se o usuário rolou para o item "falso" no final (clone do primeiro)
        else if (newIndex === originalLength + 1) {
            flatListRef.current?.scrollToOffset({
                offset: ITEM_FULL_WIDTH,
                animated: false,
            });
            currentIndex.current = 1;
        }
    }, [commerces.length]);

    const title = userProfile?.isClient ? `Comércios do seu Loteamento` : "Comércios em Destaque";
    const subtitle = userProfile?.isClient ? `O melhor da sua região` : "Conheça nossos parceiros";

    return (
        <View style={styles.section}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
                <TouchableOpacity style={styles.seeAllButton} onPress={() => navigation.navigate('Comercios')}>
                    <Text style={styles.seeAllText}>Ver todos</Text>
                    <ChevronRight size={16} color="#339949ff" />
                </TouchableOpacity>
            </View>
            
            {loading ? (
                <ActivityIndicator style={{ height: 250 }} />
            ) : (
                <Animated.FlatList
                    ref={flatListRef}
                    data={commerces}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    snapToInterval={ITEM_FULL_WIDTH}
                    decelerationRate="fast"
                    snapToAlignment="start"
                    // Define o padding para que o item alinhado ao início fique no centro
                    contentContainerStyle={{ paddingHorizontal: SIDECARD_LENGTH - (SPACING / 2) }}
                    // Pula para o primeiro item real na montagem inicial
                    initialScrollIndex={commerces.length > 1 ? 1 : 0}
                    // getItemLayout otimiza a performance ao pré-calcular a posição dos itens
                    getItemLayout={(_, index) => ({
                        length: ITEM_FULL_WIDTH,
                        offset: ITEM_FULL_WIDTH * index,
                        index,
                    })}
                    onMomentumScrollEnd={handleScrollEnd}
                    ListEmptyComponent={<Text style={{ paddingHorizontal: 16 }}>Nenhum destaque no momento.</Text>}
                    renderItem={({ item, index }) => (
                        <AnimatedCommerceCard item={item} index={index} scrollX={scrollX} />
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    section: { marginBottom: 24, paddingVertical: 10 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 16 },
    title: { fontSize: 20, fontWeight: 'bold' },
    subtitle: { color: 'gray' },
    seeAllButton: { flexDirection: 'row', alignItems: 'center' },
    seeAllText: { color: '#339949ff', fontWeight: '600', marginRight: 4 },
    cardContainer: {
        width: CARD_LENGTH,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: SPACING / 2,
    },
    card: { 
        width: '100%',
        height: '100%',
        backgroundColor: 'white', 
        borderRadius: 12, 
        overflow: 'hidden', 
        elevation: 5, 
        shadowColor: '#000', 
        shadowOpacity: 0.15, 
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    cardImage: { width: '100%', height: 150, backgroundColor: '#f0f0f0' },
    badge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
    cardContent: { padding: 12, flex: 1, justifyContent: 'center' },
    cardTitle: { fontSize: 18, fontWeight: 'bold' },
    cardDescription: { fontSize: 14, color: 'gray', marginTop: 4 },
});