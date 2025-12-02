// src/screens/Comercios/CommerceDetailScreen.tsx (VERSÃO FINAL COM O NOVO 'ProductLayout')

import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';

// Importa os componentes de layout existentes e o novo
import ModernLayout from './layouts/ModernLayout';
import ClassicLayout from './layouts/ClassicLayout';
import ProductLayout from './layouts/ProductLayout'; // 1. IMPORTAR O NOVO LAYOUT

export default function CommerceDetailScreen({ route, navigation }) {
  // A lógica de busca de dados permanece a mesma
  const [commerce, setCommerce] = useState(route.params?.commerce || null);
  const [loading, setLoading] = useState(!route.params?.commerce);
  const [error, setError] = useState<string | null>(null);
  
  const commerceId = route.params?.commerce?.id || route.params?.commerceId;

  useEffect(() => {
    if (commerce) return;

    const fetchCommerceDetails = async () => {
      if (!commerceId) {
        setError("ID do comércio não encontrado.");
        setLoading(false);
        return;
      }

      // A busca no Supabase agora pode trazer os novos campos (slogan, features, etc)
      const { data: c, error: dbError } = await supabase
        .from('comercios')
        .select('*')
        .eq('id', commerceId)
        .single();

      if (dbError) {
        setError("Não foi possível carregar os dados do comércio.");
        setLoading(false);
      } else if (c) {
        // O objeto formatado agora inclui todos os campos, novos e antigos
        const formattedData = {
          id: c.id,
          name: c.nome,
          category: c.categoria,
          description: c.descricao,
          coverImage: c.capa_url,
          logo: c.logo_url,
          images: c.galeria_urls || [],
          services: c.servicos || [],
          openingHours: c.horario_func?.display_text || 'Não informado',
          contact: { whatsapp: c.whatsapp, instagram: c.instagram },
          loteamento_id: 'Cidade_Inteligente',
          city: 'S. A. do Descoberto - GO',
          rating: c.rating || 4.5,
          featured: c.featured || false,
          layout_template: c.layout_template || 'moderno',
          // Novos campos para o ProductLayout
          slogan: c.slogan,
          secondary_slogan: c.secondary_slogan,
          video_url: c.video_url,
          store_url: c.store_url,
          features: c.features || [],
          product_list: c.product_list || [],
        };
        setCommerce(formattedData);
      }
      setLoading(false);
    };

    fetchCommerceDetails();
  }, [commerceId, commerce]);

  // Renderiza estados de carregamento e erro
  if (loading) {
    return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color="#339949ff" /></SafeAreaView>;
  }

  if (error || !commerce) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error || "Comércio não encontrado."}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backLink}>Voltar</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  // --- O ROTEADOR DE LAYOUTS ---
  // Verifica qual layout usar com base nos dados do comércio
  switch (commerce.layout_template) {
    case 'classico':
      return <ClassicLayout commerce={commerce} navigation={navigation} />;
    
    // 2. ADICIONAR O CASE PARA O NOVO LAYOUT
    case 'produto':
      return <ProductLayout commerce={commerce} navigation={navigation} />;

    case 'moderno':
    default:
      // O 'moderno' continua sendo o padrão caso a coluna esteja nula ou com valor desconhecido
      return <ModernLayout commerce={commerce} navigation={navigation} />;
  }
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: '#EF4444', textAlign: 'center' },
  backLink: { color: '#3B82F6', marginTop: 20, fontSize: 16 },
});