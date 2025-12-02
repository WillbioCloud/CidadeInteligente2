// screens/Health/HealthTabScreen.tsx (VERSÃO FINAL COMPLETA E SEM ABREVIAÇÕES)

import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput, ScrollView,
  TouchableOpacity, FlatList, ActivityIndicator, Share,
} from 'react-native';
import { Clock, Search, BookOpen, Star, ArrowLeft, Leaf, Utensils, Heart, Share2, ChevronRight } from 'lucide-react-native';
import { fetchHealthData, HealthInfo, HealthCategory } from '../../api/healthApi';
import { HealthIcon } from '../../components/HealthIcons';

// Função utilitária para formatar o tempo relativo
const formatTimeAgo = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `há ${Math.floor(interval)} anos`;
  
  interval = seconds / 2592000;
  if (interval > 1) return `há ${Math.floor(interval)} meses`;
  
  interval = seconds / 86400;
  if (interval > 1) return `há ${Math.floor(interval)} dias`;

  interval = seconds / 3600;
  if (interval > 1) return `há ${Math.floor(interval)} horas`;

  interval = seconds / 60;
  if (interval > 1) return `há ${Math.floor(interval)} minutos`;

  return 'agora mesmo';
};

// Card para a lista de dicas
const HealthTipCard = ({ item, onPress }) => {
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'Alimentação':
      case 'Receitas Saudáveis':
        return { backgroundColor: '#DCFCE7', color: '#166534' };
      case 'Exercícios':
        return { backgroundColor: '#FFF7ED', color: '#9A3412' };
      case 'Saúde Mental':
        return { backgroundColor: '#EEF2FF', color: '#4338CA' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#4B5563' };
    }
  };

  const categoryStyle = getCategoryStyle(item.category);
  const timeAgo = formatTimeAgo(item.created_at);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <HealthIcon name={item.imageKey} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardExcerpt} numberOfLines={2}>{item.excerpt}</Text>
        <View style={styles.cardFooter}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryStyle.backgroundColor }]}>
            <Text style={[styles.categoryText, { color: categoryStyle.color }]}>{item.category}</Text>
          </View>
          <Text style={styles.metaText}>{item.readTime} • {timeAgo}</Text>
        </View>
      </View>
      <ChevronRight size={20} color="#CBD5E1" />
    </TouchableOpacity>
  );
};

// Tela de detalhes da dica
const DetailView = ({ tip, onClose, isFavorited, onToggleFavorite }) => {

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${tip.title}\n\n${tip.excerpt}\n\nVeja mais no app Cidade Inteligente!`,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <View style={styles.detailControlsHeader}>
            <TouchableOpacity onPress={onClose} style={styles.iconButton}>
                <ArrowLeft size={24} color="#333" />
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => onToggleFavorite(tip.id)} style={styles.iconButton}>
                    <Heart size={24} color={isFavorited ? "#EF4444" : "#333"} fill={isFavorited ? "#EF4444" : "none"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
                    <Share2 size={24} color="#333" />
                </TouchableOpacity>
            </View>
        </View>
        
        <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.detailHeader}>
            <HealthIcon name={tip.imageKey} />
            <Text style={styles.detailTitle}>{tip.title}</Text>
            <View style={styles.detailMeta}><Clock size={14} color="#666" /><Text style={styles.detailMetaText}>{tip.readTime}</Text></View>
          </View>

          <Text style={styles.detailContent}>{tip.content}</Text>

          {Array.isArray(tip.ingredients) && tip.ingredients.length > 0 && (
            <>
              <View style={styles.section}><View style={styles.sectionHeader}><Utensils size={20} color="#4B5563"/><Text style={styles.sectionTitle}>Ingredientes</Text></View>{tip.ingredients.map((item, index) => (<View key={index} style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}>{item}</Text></View>))}</View>
              <View style={styles.section}><View style={styles.sectionHeader}><Leaf size={20} color="#4B5563"/><Text style={styles.sectionTitle}>Modo de Preparo</Text></View>{tip.instructions.map((item, index) => (<View key={index} style={styles.listItem}><Text style={styles.bullet}>{index + 1}.</Text><Text style={styles.listText}>{item}</Text></View>))}</View>
            </>
          )}
          {Array.isArray(tip.steps) && tip.steps.length > 0 && (
            <View style={styles.section}><View style={styles.sectionHeader}><Leaf size={20} color="#4B5563"/><Text style={styles.sectionTitle}>Passo a Passo</Text></View>{tip.steps.map((item, index) => (<View key={index} style={styles.listItem}><Text style={styles.bullet}>{index + 1}.</Text><Text style={styles.listText}>{item}</Text></View>))}</View>
          )}
          
          <Text style={styles.sourceText}>Fonte: {tip.source}</Text>
        </ScrollView>
    </SafeAreaView>
  );
};

// Tela principal
export default function HealthTabScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [allData, setAllData] = useState<HealthInfo[]>([]);
    const [filteredData, setFilteredData] = useState<HealthInfo[]>([]);
    const [viewMode, setViewMode] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState<HealthCategory | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
    const [selectedTip, setSelectedTip] = useState<HealthInfo | null>(null);

    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(allData.map(item => item.category)));
        return [{ id: 'all', name: 'Todas' }, ...uniqueCategories.map(cat => ({ id: cat, name: cat }))];
    }, [allData]);

    const handleToggleFavorite = (tipId: number) => {
        const newSet = new Set(bookmarkedIds);
        if (newSet.has(tipId)) {
            newSet.delete(tipId);
        } else {
            newSet.add(tipId);
        }
        setBookmarkedIds(newSet);
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            const healthDataRes = await fetchHealthData();
            setAllData(healthDataRes);
            setIsLoading(false);
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        let result = allData;
        if (viewMode === 'favorites') {
          result = result.filter(item => bookmarkedIds.has(item.id));
        }
        if (selectedCategory !== 'all') {
          result = result.filter(item => item.category === selectedCategory);
        }
        if (searchTerm) {
          result = result.filter(item =>
              item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        setFilteredData(result);
    }, [searchTerm, selectedCategory, viewMode, allData, bookmarkedIds]);

    if (isLoading) {
      return (
        <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color="#339949ff" /></SafeAreaView>
      );
    }
    
    if (selectedTip) {
      return <DetailView 
                tip={selectedTip} 
                onClose={() => setSelectedTip(null)} 
                isFavorited={bookmarkedIds.has(selectedTip.id)}
                onToggleFavorite={handleToggleFavorite}
            />;
    }
    
    return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Dicas de Saúde</Text>
              <Text style={styles.subtitle}>Conteúdo confiável para seu bem-estar</Text>
            </View>
            
            <View style={styles.toggleContainer}>
                <TouchableOpacity style={[styles.toggleButton, viewMode === 'all' && styles.toggleActive]} onPress={() => setViewMode('all')}>
                    <BookOpen size={16} color={viewMode === 'all' ? '#4A90E2' : '#4B5563'} />
                    <Text style={[styles.toggleText, viewMode === 'all' && styles.toggleTextActive]}>Todas as Dicas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toggleButton, viewMode === 'favorites' && styles.toggleActive]} onPress={() => setViewMode('favorites')}>
                    <Star size={16} color={viewMode === 'favorites' ? '#4A90E2' : '#4B5563'} />
                    <Text style={[styles.toggleText, viewMode === 'favorites' && styles.toggleTextActive]}>Favoritas ({bookmarkedIds.size})</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Search size={20} color="#A0AEC0" />
              <TextInput style={styles.searchInput} placeholder="Buscar por dicas..." value={searchTerm} onChangeText={setSearchTerm}/>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id as HealthCategory | 'all')}
                  style={[styles.categoryButton, selectedCategory === cat.id && styles.categoryActive]}
                >
                  <Text style={[styles.categoryButtonText, selectedCategory === cat.id && styles.categoryTextActive]}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        }
        data={filteredData}
        renderItem={({ item }) => (<HealthTipCard item={item} onPress={(tip) => setSelectedTip(tip)} />)}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<View style={styles.emptyContainer}><Text style={styles.emptyText}>Nenhum item encontrado.</Text><Text style={styles.emptySubtext}>Tente ajustar a busca ou os filtros.</Text></View>}
      />
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F5F7' },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#121212' },
  subtitle: { fontSize: 16, color: '#555', marginTop: 4 },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#E5E7EB', margin: 16, borderRadius: 12, padding: 4 },
  toggleButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8 },
  toggleActive: { backgroundColor: 'white', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1 },
  toggleText: { marginLeft: 8, fontSize: 14, fontWeight: '600', color: '#4B5563' },
  toggleTextActive: { color: '#4A90E2' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, marginHorizontal: 16, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  searchInput: { flex: 1, height: 48, fontSize: 16, marginLeft: 8 },
  categoryScroll: { paddingHorizontal: 16, paddingVertical: 16 },
  categoryButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'white', marginRight: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  categoryActive: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  categoryButtonText: { fontWeight: '600', color: '#4B5563' },
  categoryTextActive: { color: 'white' },
  listContainer: { paddingHorizontal: 16, paddingBottom: 100 },
  card: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 12, alignItems: 'center' },
  cardContent: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  cardExcerpt: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  categoryText: { fontSize: 12, fontWeight: 'bold' },
  metaText: { fontSize: 12, color: '#6B7280', marginLeft: 8 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#495057' },
  emptySubtext: { fontSize: 14, color: '#6c757d', marginTop: 8 },
  detailContainer: { flex: 1, paddingHorizontal: 20 },
  detailControlsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 },
  iconButton: { padding: 8 },
  detailHeader: { alignItems: 'center', marginBottom: 20 },
  detailTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 15 },
  detailMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 8, opacity: 0.7 },
  detailMetaText: { marginLeft: 6, fontSize: 14, color: '#666' },
  detailContent: { fontSize: 16, lineHeight: 26, color: '#343a40' },
  section: { marginTop: 25 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginLeft: 8 },
  listItem: { flexDirection: 'row', marginBottom: 10, paddingLeft: 8 },
  bullet: { marginRight: 10, fontSize: 16, lineHeight: 26, color: '#339949ff' },
  listText: { flex: 1, fontSize: 16, lineHeight: 26, color: '#495057' },
  sourceText: { textAlign: 'center', color: '#ADB5BD', paddingBottom: 40, paddingTop: 20, fontSize: 12 },
});