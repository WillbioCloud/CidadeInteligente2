// src/screens/Comercios/ComerciosTabScreen.tsx (VERSÃO UNIFICADA E OTIMIZADA)

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { supabase } from '../../lib/supabase';
import CommerceCard from '../../components/comercio/CommerceCard';
import { Search } from '../../components/Icons';

// --- FUNÇÃO AUXILIAR PARA FORMATAR E PROTEGER OS DADOS DO COMÉRCIO ---
const formatCommerceData = (c: any) => ({
    id: c.id,
    name: c.nome || 'Nome não informado',
    category: c.categoria || 'Sem categoria',
    description: c.descricao || '',
    coverImage: c.capa_url, // O card já tem uma imagem padrão
    images: c.galeria_urls || [],
    services: c.servicos || [],
    openingHours: c.horario_func?.display_text || 'Não informado',
    contact: { whatsapp: c.whatsapp, instagram: c.instagram },
    loteamento_id: c.loteamento_id || 'Cidade Inteligente',
    city: c.city || 'S. A. do Descoberto - GO',
    rating: c.rating || 4.5, // Rating padrão
    featured: c.featured || false,
    layout_template: c.layout_template || 'moderno',
    logo: c.logo_url,
    ativo: c.ativo,
    status: c.status,
});

export default function ComerciosTabScreen() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [allCommerces, setAllCommerces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // --- LÓGICA DE BUSCA DE DADOS, COMBINANDO FILTROS ESSENCIAIS ---
    const fetchCommerces = useCallback(async () => {
        setError(null);
        try {
            const { data, error: dbError } = await supabase
                .from('comercios')
                .select('*')
                .eq('status', 'approved') // CONDIÇÃO 1: Precisa estar APROVADO
                .is('ativo', true);       // CONDIÇÃO 2: Precisa estar ATIVO

            if (dbError) throw dbError;

            const formattedData = data.map(formatCommerceData);
            setAllCommerces(formattedData);

        } catch (e: any) {
            console.error('Erro ao buscar comércios:', e.message);
            setError('Não foi possível carregar a lista de comércios.');
            Alert.alert("Erro", "Não foi possível carregar os comércios. Tente novamente mais tarde.");
        }
    }, []);

    // --- FUNÇÃO CHAMADA AO PUXAR PARA ATUALIZAR ---
    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await fetchCommerces();
        setIsRefreshing(false);
    }, [fetchCommerces]);

    // --- LÓGICA DE ATUALIZAÇÃO EM TEMPO REAL (REALTIME) GRANULAR ---
    useEffect(() => {
        setLoading(true);
        fetchCommerces().finally(() => setLoading(false));

        const channel = supabase
            .channel('public:comercios')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'comercios' },
                (payload) => {
                    console.log('Alteração recebida!', payload);
                    const newCommerce = payload.new ? formatCommerceData(payload.new) : null;
                    const oldId = payload.old?.id;

                    switch (payload.eventType) {
                        case 'INSERT':
                            // Adiciona apenas se estiver aprovado e ativo
                            if (newCommerce && newCommerce.status === 'approved' && newCommerce.ativo) {
                                setAllCommerces(current => [newCommerce, ...current]);
                                Alert.alert("Novo Comércio!", `"${newCommerce.name}" agora está disponível!`);
                            }
                            break;
                        case 'UPDATE':
                            setAllCommerces(current => {
                                const exists = current.some(c => c.id === newCommerce?.id);
                                // Se for ativado/aprovado e não existia na lista, adiciona
                                if (newCommerce && newCommerce.status === 'approved' && newCommerce.ativo && !exists) {
                                    return [newCommerce, ...current];
                                }
                                // Se for desativado/reprovado e existia, remove
                                if (newCommerce && (newCommerce.status !== 'approved' || !newCommerce.ativo) && exists) {
                                    return current.filter(c => c.id !== newCommerce.id);
                                }
                                // Apenas atualiza um item existente
                                return current.map(c => c.id === newCommerce?.id ? newCommerce : c);
                            });
                            break;
                        case 'DELETE':
                            if (oldId) {
                                setAllCommerces(current => current.filter(c => c.id !== oldId));
                            }
                            break;
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchCommerces]);

    // --- MEMORIZAÇÃO PARA CATEGORIAS E FILTROS ---
    const categories = useMemo(() => {
        if (allCommerces.length === 0) return ['Todos'];
        const uniqueCategories = new Set(allCommerces.map(c => c.category).filter(Boolean));
        return ['Todos', ...Array.from(uniqueCategories)];
    }, [allCommerces]);

    const filteredCommerces = useMemo(() => {
        return allCommerces.filter(commerce => {
            const categoryMatch = selectedCategory === 'Todos' || commerce.category === selectedCategory;
            const searchMatch = (commerce.name || '').toLowerCase().includes(searchTerm.toLowerCase());
            return categoryMatch && searchMatch;
        });
    }, [selectedCategory, searchTerm, allCommerces]);

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#4F46E5" /></View>;
    }
    
    if (error && allCommerces.length === 0) {
        return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredCommerces}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <CommerceCard commerce={item} />}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        colors={['#4F46E5']}
                    />
                }
                ListHeaderComponent={
                    <>
                        <View style={styles.header}>
                            <Text style={styles.title}>Comércios Locais</Text>
                            <Text style={styles.subtitle}>Encontre os melhores estabelecimentos</Text>
                        </View>

                        <View style={styles.searchContainer}>
                            <Search width={20} height={20} color="#6B7280" />
                            <TextInput
                                placeholder="Buscar por nome..."
                                style={styles.searchInput}
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                            />
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
                            {categories.map(category => (
                                <TouchableOpacity
                                    key={category}
                                    style={[styles.categoryChip, selectedCategory === category && styles.categoryChipSelected]}
                                    onPress={() => setSelectedCategory(category)}
                                >
                                    <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextSelected]}>
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.subtitle}>Nenhum comércio encontrado.</Text>
                        <Text style={styles.emptyText}>Tente alterar o filtro ou o termo de busca.</Text>
                    </View>
                }
            />
        </View>
    );
}

// --- ESTILOS UNIFICADOS E MELHORADOS ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center'},
    errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
    listContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100, flexGrow: 1 },
    header: { marginBottom: 16, alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
    subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16, paddingHorizontal: 12 },
    searchInput: { flex: 1, height: 48, marginLeft: 8, fontSize: 16 },
    categoryContainer: { paddingBottom: 16 },
    categoryChip: { borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, marginRight: 8, backgroundColor: 'white' },
    categoryChipSelected: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
    categoryText: { color: '#374151', fontWeight: '500' },
    categoryTextSelected: { color: 'white', fontWeight: 'bold' },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 50 },
    emptyText: { color: '#6B7280', marginTop: 8 },
});