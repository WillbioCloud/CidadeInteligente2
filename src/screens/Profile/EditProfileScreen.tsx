// src/screens/Profile/EditProfileScreen.tsx

import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, 
    TextInput, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform 
} from 'react-native';
import { ArrowLeft, Edit2, ShieldAlert, Trash2 } from 'lucide-react-native';
import { useUserStore } from '../../hooks/useUserStore';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditProfileScreen({ navigation }) {
  const { userProfile, updateUserProfile, clearStore } = useUserStore();
  
  const [fullName, setFullName] = useState(userProfile?.full_name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [loading, setLoading] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(userProfile?.avatar_url || null);

  const AVATAR_STORAGE_KEY = `@local_avatar_uri_${userProfile?.id}`;

  useEffect(() => {
    const loadStoredAvatar = async () => {
        const storedUri = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
        if (storedUri) {
            setAvatarUri(storedUri);
        }
    };
    loadStoredAvatar();
  }, []);

  const handlePickAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão Necessária", "Você precisa de permitir o acesso à galeria para alterar a sua foto.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri);
      await AsyncStorage.setItem(AVATAR_STORAGE_KEY, uri);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    const updates = { id: userProfile.id, full_name: fullName, phone, updated_at: new Date() };
    const { error } = await supabase.from('profiles').upsert(updates);
    
    if (error) {
      Alert.alert('Erro', 'Não foi possível atualizar as informações do perfil.');
    } else {
      updateUserProfile({ full_name: fullName, phone, avatar_url: avatarUri });
      Alert.alert('Sucesso!', 'Seu perfil foi atualizado.');
      navigation.goBack();
    }
    setLoading(false);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir Conta Permanentemente",
      "Tem a certeza de que deseja excluir a sua conta? Esta ação é irreversível e todos os seus dados, pontos e conquistas serão perdidos.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sim, Excluir", 
          style: "destructive", 
          onPress: async () => {
            const { error } = await supabase.functions.invoke('delete-user');
            if (error) {
                Alert.alert("Erro", "Não foi possível excluir a sua conta. Por favor, tente novamente ou contacte o suporte.");
            } else {
                await supabase.auth.signOut();
                clearStore();
                // O AppRouter irá redirecionar para a tela de login.
            }
          }
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ArrowLeft size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Editar Perfil</Text>
            <View style={{width: 40}} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.avatarSection}>
                <TouchableOpacity onPress={handlePickAvatar}>
                    <Image 
                        source={{ uri: avatarUri || 'https://placehold.co/200' }} 
                        style={styles.avatar} 
                    />
                    <View style={styles.cameraIcon}>
                        <Edit2 size={14} color="white" />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
                
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={userProfile?.email} editable={false} selectTextOnFocus={false} />

                <Text style={styles.label}>Telefone</Text>
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="(00) 00000-0000" />
            </View>

             <View style={styles.footer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Salvar Alterações</Text>}
            </TouchableOpacity>
        </View>

            <View style={styles.dangerZone}>
                <View style={styles.dangerHeader}>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                    <Trash2 size={20} color="#DC2626" />
                    <Text style={styles.deleteButtonText}>Excluir minha conta</Text>
                </TouchableOpacity>
                 <Text style={styles.dangerDescription}>Esta ação é permanente e não pode ser desfeita.</Text>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', marginBottom: 85 },
  keyboardView: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: 'white'
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  backButton: { padding: 8 },
  scrollContainer: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 32 },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E2E8F0', borderWidth: 3, borderColor: 'white' },
  cameraIcon: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#4F46E5', padding: 10, borderRadius: 20, borderWidth: 2, borderColor: 'white' },
  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: '500', color: '#334155', marginBottom: 8 },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 16,
    color: '#1E293B',
    marginBottom: 24,
  },
  dangerZone: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 24,
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B91C1C',
    marginLeft: 8,
  },
  dangerDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    bottom: 55,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 65,
  },
  deleteButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: { 
    padding: 16, 
    paddingBottom: Platform.OS === 'ios' ? 24 : 16, // Espaçamento seguro para iOS
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  saveButton: { 
    backgroundColor: '#4F46E5', 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    minHeight: 54, 
    justifyContent: 'center' 
  },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});