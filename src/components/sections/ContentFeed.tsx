// src/components/sections/ContentFeed.tsx (VERSÃO SIMPLIFICADA PARA A HOME)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Calendar, ChevronRight } from '../Icons';
import { supabase } from '../../lib/supabase';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { useNavigation } from '@react-navigation/native';

interface FeedPost {
  id: number;
  title: string;
  image_url: string;
  published_at: string;
}

export const ContentFeed = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('news_feed')
        .select('id, title, image_url, published_at')
        .order('published_at', { ascending: false })
        .limit(4);

      setPosts(data || []);
      setLoading(false);
    };

    fetchFeed();
  }, []);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View>
            <Text style={styles.title}>Novidades do Loteamento</Text>
            <Text style={styles.subtitle}>Fique por dentro de tudo que acontece</Text>
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
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Feed')}>
              <Image source={{ uri: item.image_url }} style={styles.cardImage} />
              <View style={styles.dateBadge}>
                <Calendar size={12} color="black" />
                <Text style={styles.dateText}>{formatTimeAgo(item.published_at)}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: 'gray' },
  seeAllButton: { flexDirection: 'row', alignItems: 'center' },
  seeAllText: { color: '#339949ff', fontWeight: '600', marginRight: 4 },
  card: { width: 280, marginRight: 16, backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  cardImage: { width: '100%', height: 140 },
  dateBadge: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.85)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  dateText: { fontSize: 12, marginLeft: 4, fontWeight: '500' },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
});