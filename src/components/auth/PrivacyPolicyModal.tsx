// src/components/auth/PrivacyPolicyModal.tsx

import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { CheckCircle } from 'lucide-react-native';

interface PrivacyPolicyModalProps {
  isVisible: boolean;
  onAccept: () => void;
}

// O texto completo da sua política de privacidade
const policyText = `
**Última atualização:** 13 de agosto de 2025

Bem-vindo ao aplicativo Cidade Inteligente. Sua privacidade é de extrema importância para nós. Esta Política de Privacidade explica como coletamos, usamos, protegemos e compartilhamos suas informações quando você utiliza nossos serviços.

**1. Informações que Coletamos**

Para fornecer uma experiência rica e funcional, coletamos os seguintes tipos de informações:

- **Dados de Perfil e Autenticação:** Nome completo, endereço de e-mail, número de telefone, tipo de usuário (cliente ou visitante), foto de perfil/avatar, e credenciais de acesso seguras.
- **Dados de Propriedade e Localização:** Loteamento, quadra e lote associados à sua conta de cliente e coordenadas de pontos de interesse para funcionalidades do mapa.
- **Dados de Interação no Aplicativo:** Histórico de missões, pontos (XP), moedas, nível, recompensas, conquistas, curtidas, comentários, agendamentos de espaços e tickets de suporte.

**2. Como Coletamos Suas Informações**

- **Coleta Direta:** Coletamos as informações que você nos fornece diretamente ao criar uma conta, editar seu perfil, interagir com funcionalidades como o feed, gamificação e agendamentos.
- **Coleta Automática:** Registramos informações de login e atividade de sessão para fins de segurança e para melhorar a sua experiência.

**3. Como Usamos Suas Informações**

- **Para Funcionalidades do Aplicativo:** Para personalizar sua experiência, gerenciar o sistema de gamificação, permitir interações com a comunidade e operacionalizar agendamentos.
- **Para Comunicação:** Para enviar notificações relevantes sobre o seu loteamento e prestar suporte ao cliente.
- **Para Segurança e Melhoria:** Para prevenir fraudes e analisar dados de uso de forma agregada para melhorar o aplicativo.

**4. Compartilhamento de Informações**

Não vendemos ou alugamos seus dados pessoais. Suas informações de perfil público (nome e avatar) podem ser visíveis em interações sociais, como comentários e no ranking de gamificação.

**5. Segurança dos Dados**

Utilizamos os recursos de segurança do Supabase, incluindo autenticação segura, políticas de segurança a nível de linha (RLS) e criptografia. Oferecemos uma função segura para a exclusão completa da sua conta e dados associados.

**6. Seus Direitos**

De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de acessar, corrigir e solicitar a exclusão dos seus dados a qualquer momento.

**7. Cookies e Tecnologias de Rastreamento**

Utilizamos tecnologias como tokens de autenticação (JWT) e armazenamento local seguro para manter sua sessão ativa e salvar suas preferências.

**8. Privacidade de Menores**

Nosso aplicativo não se destina a menores de 13 anos.

**9. Mudanças nesta Política**

Notificaremos você sobre quaisquer alterações, publicando a nova política no aplicativo.

**10. Contato**

Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco através do e-mail: privacidade@fbzempreendimentos.com.br
`;

export default function PrivacyPolicyModal({ isVisible, onAccept }: PrivacyPolicyModalProps) {
  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      onRequestClose={() => { /* Impede o fechamento pelo botão de voltar do Android */ }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Política de Privacidade</Text>
          <Text style={styles.subtitle}>
            Para continuar, por favor, leia e aceite nossos termos.
          </Text>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Renderiza o texto, removendo a formatação de negrito do markdown */}
          <Text style={styles.policyContent}>{policyText.replace(/\*\*/g, '')}</Text>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <CheckCircle size={20} color="white" />
            <Text style={styles.acceptButtonText}>Aceitar e Continuar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
    padding: 24,
  },
  policyContent: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#16A34A',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});