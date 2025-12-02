// src/components/home/InstagramSection.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Instagram } from 'lucide-react-native';

// Interface para definir o formato de um post do Instagram
interface InstagramPost {
  id: string;
  media_url: string;
  thumbnail_url?: string; // Para vídeos
  caption: string;
  permalink: string;
  media_type: 'IMAGE' | 'VIDEO';
}

export const InstagramSection = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        setLoading(true);
        // Chama a Edge Function que você criou
        const { data, error: functionError } = await supabase.functions.invoke('get-instagram-posts');
        
        if (functionError) {
          throw functionError;
        }
        
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar posts do Instagram:", err);
        setError("Não foi possível carregar as novidades.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  const openPostInInstagram = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Não foi possível abrir o link:", err));
  };

  const renderPost = ({ item }: { item: InstagramPost }) => (
    <TouchableOpacity style={styles.card} onPress={() => openPostInInstagram(item.permalink)}>
      <Image 
        source={{ uri: item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url }} 
        style={styles.cardImage} 
      />
      <View style={styles.cardOverlay}>
        <Text style={styles.cardCaption} numberOfLines={2}>{item.caption}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Instagram size={24} color="#C13584" />
        <Text style={styles.title}>Últimas do Instagram</Text>
      </View>
      
      {loading && <ActivityIndicator size="large" color="#C13584" style={{ marginTop: 20 }} />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      {!loading && !error && (
        <FlatList
          data={posts}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingLeft: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listContainer: {
    paddingRight: 16,
  },
  card: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#E5E7EB',
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardCaption: {
    color: 'white',
    fontSize: 13,
  },
  errorText: {
    textAlign: 'center',
    color: '#EF4444',
    margin: 20,
  }
});