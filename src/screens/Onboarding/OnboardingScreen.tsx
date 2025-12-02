// src/screens/Onboarding/OnboardingScreen.tsx

import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, Dimensions, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../hooks/useUserStore';
import { ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const onboardingSteps = [
  {
    key: '1',
    title: 'Bem-vindo à Cidade Inteligente!',
    description: 'Explore todas as funcionalidades pensadas para facilitar o seu dia a dia no seu loteamento.',
    image: require('../../assets/concept/onboarding_1.png'), // Caminho corrigido
  },
  {
    key: '2',
    title: 'Gamificação e Recompensas',
    description: 'Complete missões, suba de nível e troque os seus pontos por recompensas exclusivas na nossa loja.',
    image: require('../../assets/concept/onboarding_2.png'), // Caminho corrigido
  },
  {
    key: '3',
    title: 'Conecte-se com a Comunidade',
    description: 'Fique por dentro das novidades, eventos e interaja com os seus vizinhos através do nosso feed.',
    image: require('../../assets/concept/onboarding_3.png'), // Caminho corrigido
  },
];

const OnboardingItem = ({ item }) => {
  return (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
};

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const { userProfile, updateUserProfile } = useUserStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < onboardingSteps.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleDone();
    }
  };

  const handleDone = async () => {
    if (!userProfile?.id) return;
    try {
      // Atualiza o perfil no Supabase para não mostrar o tutorial novamente
      const { error } = await supabase
        .from('profiles')
        .update({ has_completed_onboarding: true })
        .eq('id', userProfile.id);
      
      if (error) throw error;

      // Atualiza o estado local para forçar a navegação para a tela principal
      updateUserProfile({ has_completed_onboarding: true });
    } catch (error) {
      console.error("Erro ao finalizar o onboarding:", error);
      Alert.alert("Erro", "Não foi possível salvar a sua preferência. Por favor, tente novamente.");
    }
  };
  
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        ref={flatListRef}
        data={onboardingSteps}
        renderItem={({ item }) => <OnboardingItem item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.dotActive,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <ArrowRight size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  pagination: {
    flexDirection: 'row',
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#16A34A',
  },
  nextButton: {
    backgroundColor: '#16A34A',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
