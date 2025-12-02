export interface Dependent {
  id: string;
  fullName: string;
  relationship: string;
  contributedPoints: number;
  missionsCompleted: number;
  permissions: { canInvite: boolean; };
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  quadra: string;
  lote: string;
  dependents: Dependent[];
  points: number;
  level: number;
}

export const mockUser: User = {
  id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  fullName: 'Ricardo Willian',
  email: 'ricardowillbio77@gmail.com',
  quadra: 'Qd. 01', // Corrigido para corresponder à imagem
  lote: 'Lt. 25',
  points: 0,     // <-- CORRIGIDO: Usuário começa com 0 pontos
  level: 1,      // <-- CORRIGIDO: Usuário começa no nível 1
  dependents: [],
};

export const getFirstName = (fullName: string): string => {
  if (!fullName) return '';
  return fullName.split(' ')[0];
};