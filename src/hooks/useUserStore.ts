// src/hooks/useUserStore.ts (VERSÃO FINAL COM A CORREÇÃO DE TENTATIVAS)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { Loteamento, LOTEAMENTOS_CONFIG } from '../data/loteamentos.data';
import { THEME_COLORS } from '../styles/designSystem';

// --- SUAS INTERFACES (sem alterações) ---
export interface UserProperty {
  id: string;
  loteamento_id: string;
  quadra: string;
  lote: string;
}

export interface Profile {
  id: string;
  full_name: string;
  isClient?: boolean;
  avatar_url?: string;
  email?: string;
  points?: number;
  level?: number;
  properties?: UserProperty[];
  dependents?: any[];
  available_achievements?: string[];
  displayed_achievements?: string[];
  phone?: string;
}

export interface ThemeColors {
  primary: string;
  accent: string;
  light: string;
  gradient: string[];
}

interface UserState {
  session: any | null;
  userProfile: Profile | null;
  selectedLoteamentoId: string | null;
  _hasHydrated: boolean;
  setSession: (session: any) => void;
  setUserProfile: (profile: Profile | null, properties: UserProperty[]) => void;
  setSelectedLoteamentoId: (loteamentoId: string) => void;
  setHasHydrated: (state: boolean) => void;
  fetchUserProfile: (session: any) => Promise<void>;
  clearStore: () => void;
  updateUserProfile: (updates: Partial<Profile>) => void;
  setDisplayedAchievements: (achievements: string[]) => void;
  getCurrentLoteamento: () => Loteamento | undefined;
  getThemeColors: () => ThemeColors;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      session: null,
      userProfile: null,
      selectedLoteamentoId: 'cidade_inteligente',
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setSession: (session) => set({ session }),
      setSelectedLoteamentoId: (loteamentoId) => set({ selectedLoteamentoId: loteamentoId }),

      setUserProfile: (profile, properties) => {
        const isClient = !!(properties && properties.length > 0);
        let selectedId = get().selectedLoteamentoId || 'cidade_inteligente';
        if (isClient && properties[0]?.loteamento_id) {
          selectedId = properties[0].loteamento_id;
        }
        set({
          userProfile: profile ? { ...profile, properties, isClient } : null,
          selectedLoteamentoId: selectedId,
        });
      },

      // --- FUNÇÃO CORRIGIDA AQUI ---
      fetchUserProfile: async (session) => {
        if (!session?.user) return;

        const fetchProfileWithRetries = async (retries = 3, delay = 500) => {
          try {
            console.log(`Buscando perfil... Tentativas restantes: ${retries}`);

            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            // Se o erro for "nenhuma linha encontrada" e ainda houver tentativas, tenta de novo
            if (error && error.code === 'PGRST116' && retries > 0) {
              console.warn('Perfil ainda não encontrado. Tentando novamente em 500ms.');
              await new Promise(res => setTimeout(res, delay));
              return fetchProfileWithRetries(retries - 1, delay);
            }

            // Se for qualquer outro tipo de erro, lança para o catch
            if (error && error.code !== 'PGRST116') {
              throw error;
            }

            // Se encontrou, busca as propriedades
            const { data: propertiesData, error: propertiesError } = await supabase
              .from('user_properties')
              .select('*')
              .eq('user_id', session.user.id);
            
            if (propertiesError) throw propertiesError;

            // Atualiza o estado da aplicação
            get().setUserProfile(data, propertiesData || []);

          } catch (error) {
            console.error("Erro crítico ao buscar perfil do usuário:", error);
            // Desloga o usuário para evitar que ele fique em um estado inconsistente
            get().clearStore();
            supabase.auth.signOut();
          }
        };

        // Inicia a busca com a lógica de tentativas
        await fetchProfileWithRetries();
      },
      
      updateUserProfile: (updates) => {
        set(state => ({
            userProfile: state.userProfile ? { ...state.userProfile, ...updates } : null
        }))
      },

      setDisplayedAchievements: (achievements) => {
        set(state => ({
          userProfile: state.userProfile
            ? { ...state.userProfile, displayed_achievements: achievements }
            : null,
        }));
      },

      getCurrentLoteamento: () => {
        const state = get();
        return LOTEAMENTOS_CONFIG[state.selectedLoteamentoId!];
      },

      getThemeColors: () => {
        const loteamento = get().getCurrentLoteamento();
        const defaultTheme = THEME_COLORS['dark_blue'];
        if (!loteamento || !THEME_COLORS[loteamento.color]) {
            return defaultTheme;
        }
        return THEME_COLORS[loteamento.color];
      },

      clearStore: () => set({ session: null, userProfile: null, _hasHydrated: true }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);