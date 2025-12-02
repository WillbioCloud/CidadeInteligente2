// src/navigation/AppModals.tsx (VERSÃO COM LOGOUT CORRIGIDO)

import React from 'react';
import { useModals } from '../context/ModalContext';
import { supabase } from '../lib/supabase';
import * as SecureStore from 'expo-secure-store'; // Importa o SecureStore

import ProfileModal from '../components/layout/ProfileModal';
import NotificationsModal from '../components/layout/NotificationsModal';

const CREDENTIALS_KEY = 'userCredentials'; // Mesma chave usada no LoginScreen

export default function AppModals() {
  const { isProfileVisible, hideProfile, isNotificationsVisible, hideNotifications } = useModals();
  
  const handleLogout = async () => {
    hideProfile();
    // Limpa as credenciais da biometria
    await SecureStore.deleteItemAsync(CREDENTIALS_KEY); 
    // Faz o logout no Supabase
    await supabase.auth.signOut();
    // O onAuthStateChange no AppRouter cuidará de limpar o store.
  };

  return (
    <>
      <ProfileModal 
        isVisible={isProfileVisible} 
        onClose={hideProfile} 
        onLogout={handleLogout} 
      />
      <NotificationsModal 
        isVisible={isNotificationsVisible} 
        onClose={hideNotifications} 
      />
    </>
  );
}