// src/screens/Profile/PrivacyPolicyScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

const policyText = `
Política de Privacidade do Aplicativo Cidade Inteligente

Última atualização: 13 de agosto de 2025

Bem-vindo ao aplicativo Cidade Inteligente. Sua privacidade é de extrema importância para nós. Esta Política de Privacidade explica como coletamos, usamos, protegemos e compartilhamos suas informações quando você utiliza nossos serviços.

1. Informações que Coletamos
Para fornecer uma experiência rica e funcional, coletamos os seguintes tipos de informações:

- Dados de Perfil e Autenticação: Nome completo, endereço de e-mail, número de telefone, tipo de usuário, foto de perfil/avatar, e credenciais de acesso.
- Dados de Propriedade e Localização: Loteamento, quadra e lote associados à sua conta de cliente e coordenadas de pontos de interesse.
- Dados de Interação no Aplicativo: Histórico de missões, pontos (XP), moedas, nível, recompensas, conquistas, curtidas, comentários, agendamentos e tickets de suporte.

2. Como Coletamos Suas Informações
- Coleta Direta: Informações que você nos fornece ao criar uma conta, editar seu perfil, interagir com funcionalidades como o feed, gamificação e agendamentos.
- Coleta Automática: Registros de login e atividade de sessão para segurança e melhoria do serviço.

3. Como Usamos Suas Informações
- Para Funcionalidades do Aplicativo: Personalizar sua experiência, gerenciar o sistema de gamificação, permitir interações sociais e operacionalizar agendamentos.
- Para Comunicação: Enviar notificações relevantes e prestar suporte ao cliente.
- Para Segurança e Melhoria: Prevenir fraudes e analisar dados de uso de forma agregada para melhorar o aplicativo.

4. Compartilhamento de Informações
Não vendemos, alugamos ou trocamos seus dados pessoais com terceiros. Suas informações de perfil público (nome e avatar) podem ser visíveis em interações sociais, como comentários e no ranking de gamificação.

5. Segurança dos Dados
Utilizamos os recursos de segurança do Supabase, incluindo autenticação segura, políticas de segurança a nível de linha (RLS) e criptografia. Oferecemos uma função segura para a exclusão completa da sua conta e dados associados.

6. Seus Direitos
De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de acessar, corrigir, solicitar a exclusão e solicitar a portabilidade dos seus dados.

7. Cookies e Tecnologias de Rastreamento
Utilizamos tecnologias como tokens de autenticação (JWT) e armazenamento local seguro para manter sua sessão ativa e salvar suas preferências.

8. Privacidade de Menores
Nosso aplicativo não se destina a menores de 13 anos.

9. Mudanças nesta Política
Notificaremos você sobre quaisquer alterações, publicando a nova política no aplicativo.

10. Contato
Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco através do e-mail: privacidade@fbzempreendimentos.com.br
`;

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacidade</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.policyContent}>{policyText}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  backButton: { padding: 8 },
  scrollContent: { padding: 24 },
  policyContent: { fontSize: 15, lineHeight: 24, color: '#374151' },
});