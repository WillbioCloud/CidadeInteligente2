// src/screens/Auth/RegisterScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image, StatusBar } from 'react-native';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, CheckSquare, Square } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { PrivacyPolicyModal } from '../../components/PrivacyPolicyModal';

// Componente reutilizado para os botões de login social
const SocialLogins = () => (
  <>
    <View style={styles.dividerContainer}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>Ou cadastre-se com</Text>
      <View style={styles.dividerLine} />
    </View>
    <View style={styles.socialButtonsContainer}>
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require('../../assets/logos/google.png')} style={styles.socialIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require('../../assets/logos/facebook.png')} style={styles.socialIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require('../../assets/logos/apple.png')} style={styles.socialIcon} />
      </TouchableOpacity>
    </View>
  </>
);

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false); // Estado para o checkbox

  const handleRegister = async () => {
    // Validação do checkbox
    if (!agreedToPolicy) {
      Alert.alert('Termos Não Aceites', 'Você precisa de aceitar a Política de Privacidade para criar uma conta.');
      return;
    }

    if (!fullName || !email || !password) {
      Alert.alert('Campos Incompletos', 'Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true);
    const { data: { user }, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          has_accepted_privacy_policy: true,
        },
      },
    });

    if (error) {
      Alert.alert('Erro no Cadastro', error.message);
    } else if (user) {
      Alert.alert(
        'Cadastro Realizado!',
        'Verifique o seu email para confirmar a conta e depois faça o login.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Comece a sua jornada connosco.</Text>

        <View style={styles.form}>
            <Text style={styles.label}>O seu nome</Text>
            <View style={styles.inputWrapper}>
                <UserIcon size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Nome completo" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
            </View>

            <Text style={styles.label}>O seu email</Text>
            <View style={styles.inputWrapper}>
                <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="email@exemplo.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            </View>

            <Text style={styles.label}>A sua senha</Text>
            <View style={styles.inputWrapper}>
                <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="mín. 8 caracteres" value={password} onChangeText={setPassword} secureTextEntry={!isPasswordVisible} />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    {isPasswordVisible ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                </TouchableOpacity>
            </View>

            {/* Checkbox da Política de Privacidade */}
            <TouchableOpacity style={styles.policyContainer} onPress={() => setAgreedToPolicy(!agreedToPolicy)}>
                {agreedToPolicy ? <CheckSquare size={24} color="#16A34A" /> : <Square size={24} color="#9CA3AF" />}
                <Text style={styles.policyText}>
                    Eu li e concordo com a <Text style={styles.linkText} onPress={() => {/* Navegar para a tela da política */}}>Política de Privacidade</Text>.
                </Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Criar Conta</Text>}
        </TouchableOpacity>

        <SocialLogins />

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>Já tem uma conta? <Text style={styles.linkText}>Faça Login</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    content: { paddingHorizontal: 24, paddingVertical: 20, justifyContent: 'center', flexGrow: 1 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#111827', textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#6B7280', marginTop: 8, textAlign: 'center', marginBottom: 40 },
    form: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 15, marginBottom: 15 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, height: 50, fontSize: 16, color: '#111827' },
    button: { backgroundColor: '#16A34A', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
    dividerText: { marginHorizontal: 10, color: '#9CA3AF' },
    socialButtonsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
    socialButton: { padding: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 999 },
    socialIcon: { width: 28, height: 28 },
    footerButton: { marginTop: 30, alignItems: 'center' },
    footerText: { fontSize: 16, color: '#6B7280' },
    linkText: { color: '#16A34A', fontWeight: 'bold' },
    policyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    policyText: {
        marginLeft: 12,
        fontSize: 14,
        color: '#6B7280',
        flexShrink: 1,
    }
});