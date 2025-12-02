// src/screens/Home/HomeTabScreen.tsx (VERSÃO FINAL UNIFICADA)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import * as VideoThumbnails from 'expo-video-thumbnails';

// Componentes e utilitários necessários que estavam em ContentFeed
import { Calendar, ChevronRight } from '../../components/Icons';
import { supabase } from '../../lib/supabase';
import { formatTimeAgo } from '../../utils/formatTimeAgo';

// Seções da Home
import { CommerceHighlight } from '../../components/sections/CommerceHighlight';
import { ResidentFeatures } from '../../components/sections/ResidentFeatures';

// --- INÍCIO DA LÓGICA DO CONTENTFEED (AGORA DENTRO DA HOMETABSCREEN) ---

// Interface para o formato do post
interface FeedPost {
  id: number;
  title: string;
  image_url: string;
  video_url?: string;
  media_type?: 'IMAGE' | 'VIDEO';
  published_at: string;
}

// Componente interno para o card do post com thumbnail
const PostCard = ({ item }) => {
  const navigation = useNavigation();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(item.image_url);

  useEffect(() => {
    const generateThumbnail = async () => {
      if (item.media_type === 'VIDEO' && item.video_url) {
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(
            item.video_url,
            { time: 1000 }
          );
          setThumbnailUrl(uri);
        } catch (e) {
          console.warn('Erro ao gerar thumbnail:', e);
          setThumbnailUrl(item.image_url);
        }
      }
    };
    generateThumbnail();
  }, [item]);

  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Feed')}>
      <Image source={{ uri: thumbnailUrl || 'https://placehold.co/280x140' }} style={styles.cardImage} />
      <View style={styles.dateBadge}>
        <Calendar size={12} color="black" />
        <Text style={styles.dateText}>{formatTimeAgo(item.published_at)}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Componente da seção de Novidades (ContentFeed)
const ContentFeed = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('news_feed')
        .select('id, title, image_url, video_url, media_type, published_at')
        .order('published_at', { ascending: false })
        .limit(4);

      setPosts(data || []);
      setLoading(false);
    };
    fetchFeed();
  }, []);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Novidades do Loteamento</Text>
          <Text style={styles.sectionSubtitle}>Fique por dentro de tudo que acontece</Text>
        </View>
        <TouchableOpacity style={styles.seeAllButton} onPress={() => navigation.navigate('Feed')}>
          <Text style={styles.seeAllText}>Ver todos</Text>
          <ChevronRight size={16} color="#339949ff" />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#339949ff" style={{ marginVertical: 40 }} />}
      
      {!loading && (
        <FlatList
          data={posts}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingLeft: 16 }}
          renderItem={({ item }) => <PostCard item={item} />}
        />
      )}
    </View>
  );
};

// --- FIM DA LÓGICA DO CONTENTFEED ---


// --- COMPONENTE PRINCIPAL DA TELA HOME ---
export default function HomeTabScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const route = useRoute();
  const { scrollToEnd } = route.params || {};

  useFocusEffect(
    React.useCallback(() => {
      if (scrollToEnd) {
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 300);
      }
    }, [scrollToEnd])
  );

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* As seções continuam sendo chamadas normalmente */}
      <CommerceHighlight />
      <ResidentFeatures />
      <ContentFeed />
    </ScrollView>
  );
}

// --- ESTILOS (UNIFICADOS) ---
const styles = StyleSheet.create({
  // Estilos da HomeTabScreen
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    paddingVertical: 16,
    paddingTop: 16,
    paddingBottom: 84,
  },
  // Estilos do ContentFeed
  section: { 
    marginBottom: 24 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16, 
    paddingHorizontal: 16 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  sectionSubtitle: { 
    color: 'gray' 
  },
  seeAllButton: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  seeAllText: { 
    color: '#339949ff', 
    fontWeight: '600', 
    marginRight: 4 
  },
  card: { 
    width: 280, 
    marginRight: 16, 
    backgroundColor: 'white', 
    borderRadius: 12, 
    overflow: 'hidden', 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5 
  },
  cardImage: { 
    width: '100%', 
    height: 140, 
    backgroundColor: '#e0e0e0' 
  },
  dateBadge: { 
    position: 'absolute', 
    top: 10, 
    left: 10, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.85)', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  dateText: { 
    fontSize: 12, 
    marginLeft: 4, 
    fontWeight: '500' 
  },
  cardContent: { 
    padding: 12 
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});