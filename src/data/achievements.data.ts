// Este é o arquivo completo e atualizado com todas as conquistas.

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Nome do ícone do Ionicons
  category: string;
  difficulty: 'Bronze' | 'Prata' | 'Ouro' | 'Platina' | 'Diamante';
  points: number;
  requirements: string[];
  earned: boolean;
  progress?: number;
  maxProgress?: number;
  secret?: boolean;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // === Limpeza e Organização ===
  { id: 'primeiro_passo', title: 'Primeiro Passo', description: 'Complete sua primeira missão de limpeza', icon: 'footsteps-outline', category: 'limpeza', difficulty: 'Bronze', points: 50, requirements: ['Completar 1 missão de limpeza'], earned: true },
  { id: 'lote_impecavel', title: 'Lote Impecável', description: 'Mantenha seu lote limpo por 30 dias consecutivos', icon: 'sparkles-outline', category: 'limpeza', difficulty: 'Ouro', points: 500, requirements: ['30 dias consecutivos com lote limpo'], earned: false, progress: 7, maxProgress: 30 },
  { id: 'vizinho_modelo', title: 'Vizinho Modelo', description: 'Seja exemplo de organização na quadra', icon: 'trophy-outline', category: 'limpeza', difficulty: 'Prata', points: 200, requirements: ['Manter lote limpo', 'Ajudar 3 vizinhos'], earned: true },
  
  // === Reciclagem e Sustentabilidade ===
  { id: 'eco_warrior', title: 'Eco Warrior', description: 'Separe lixo corretamente por 7 dias seguidos', icon: 'leaf-outline', category: 'sustentabilidade', difficulty: 'Bronze', points: 100, requirements: ['7 dias de separação correta'], earned: true },
  { id: 'guardiao_verde', title: 'Guardião Verde', description: 'Plante 5 mudas no Banco de Mudas', icon: 'flower-outline', category: 'sustentabilidade', difficulty: 'Prata', points: 300, requirements: ['Plantar 5 mudas no viveiro'], earned: false, progress: 2, maxProgress: 5 },
  { id: 'mestre_reciclagem', title: 'Mestre da Reciclagem', description: 'Recicle 100kg de material em 30 dias', icon: 'sync-circle-outline', category: 'sustentabilidade', difficulty: 'Ouro', points: 600, requirements: ['100kg reciclados em 30 dias'], earned: false },

  // === Esportes e Atividades ===
  { id: 'atleta_local', title: 'Atleta Local', description: 'Use as quadras esportivas 10 vezes', icon: 'basketball-outline', category: 'esportes', difficulty: 'Bronze', points: 150, requirements: ['10 usos das quadras poliesportivas'], earned: false, progress: 3, maxProgress: 10 },
  { id: 'rei_da_areia', title: 'Rei da Areia', description: 'Vença 5 partidas nas quadras de areia', icon: 'tennisball-outline', category: 'esportes', difficulty: 'Prata', points: 250, requirements: ['5 vitórias nas quadras de areia'], earned: false },
  { id: 'tenista_amador', title: 'Tenista Amador', description: 'Jogue tênis por 20 horas no mês', icon: 'tennisball-outline', category: 'esportes', difficulty: 'Ouro', points: 400, requirements: ['20 horas de tênis em 30 dias'], earned: false },
  { id: 'caminhante_dedicado', title: 'Caminhante Dedicado', description: 'Complete 50km no Calçadão', icon: 'walk-outline', category: 'esportes', difficulty: 'Prata', points: 300, requirements: ['50km percorridos no calçadão'], earned: false, progress: 15, maxProgress: 50 },
  { id: 'maratonista', title: 'Maratonista', description: 'Percorra 100km no calçadão', icon: 'run-outline', category: 'esportes', difficulty: 'Platina', points: 800, requirements: ['100km no calçadão'], earned: false },

  // === Vida Comunitária ===
  { id: 'social_butterfly', title: 'Borboleta Social', description: 'Participe de 5 eventos no Auditório', icon: 'easel-outline', category: 'comunidade', difficulty: 'Bronze', points: 120, requirements: ['5 eventos no Auditório Parque Linear'], earned: false, progress: 1, maxProgress: 5 },
  { id: 'guardiao_pets', title: 'Guardião dos Pets', description: 'Use o Espaço PET 15 vezes', icon: 'paw-outline', category: 'comunidade', difficulty: 'Prata', points: 200, requirements: ['15 visitas ao Espaço PET'], earned: false },
  { id: 'anjo_da_guarda', title: 'Anjo da Guarda TEA', description: 'Ajude na Praça Azul TEA por 10 horas', icon: 'heart-outline', category: 'comunidade', difficulty: 'Ouro', points: 500, requirements: ['10 horas de voluntariado na Praça TEA'], earned: false },
  { id: 'mestre_dos_jogos', title: 'Mestre dos Jogos', description: 'Vença 3 tipos diferentes na Praça de Jogos', icon: 'game-controller-outline', category: 'comunidade', difficulty: 'Prata', points: 250, requirements: ['Vencer em 3 jogos diferentes'], earned: false },

  // === Transporte Sustentável ===
  { id: 'ciclista_urbano', title: 'Ciclista Urbano', description: 'Use os bicicletários 20 vezes', icon: 'bicycle-outline', category: 'transporte', difficulty: 'Bronze', points: 100, requirements: ['20 usos dos bicicletários'], earned: false, progress: 8, maxProgress: 20 },
  { id: 'eco_commuter', title: 'Eco Commuter', description: 'Use transporte público por 30 dias', icon: 'bus-outline', category: 'transporte', difficulty: 'Ouro', points: 400, requirements: ['30 dias usando transporte público'], earned: false },
  { id: 'parking_master', title: 'Parking Master', description: 'Use estacionamentos sustentáveis 50 vezes', icon: 'car-sport-outline', category: 'transporte', difficulty: 'Prata', points: 180, requirements: ['50 usos de estacionamento sustentável'], earned: false },

  // === Educação e Desenvolvimento ===
  { id: 'eterno_estudante', title: 'Eterno Estudante', description: 'Complete 3 cursos na Secretaria de Educação', icon: 'book-outline', category: 'educacao', difficulty: 'Prata', points: 350, requirements: ['3 cursos concluídos'], earned: false },
  { id: 'cidadao_ativo', title: 'Cidadão Ativo', description: 'Use o Poupatempo 5 vezes', icon: 'document-text-outline', category: 'educacao', difficulty: 'Bronze', points: 75, requirements: ['5 serviços no Poupatempo'], earned: false },

  // === Saúde e Bem-Estar ===
  { id: 'fitness_guru', title: 'Fitness Guru', description: 'Use a Academia ao Ar Livre 30 vezes', icon: 'barbell-outline', category: 'saude', difficulty: 'Ouro', points: 450, requirements: ['30 treinos na academia ao ar livre'], earned: false, progress: 12, maxProgress: 30 },
  { id: 'vigilante_saude', title: 'Vigilante da Saúde', description: 'Visite a Secretaria da Saúde 3 vezes', icon: 'medkit-outline', category: 'saude', difficulty: 'Bronze', points: 80, requirements: ['3 consultas/serviços de saúde'], earned: false },
  { id: 'zen_master', title: 'Zen Master', description: 'Medite 21 dias nas Áreas de Vivência', icon: 'body-outline', category: 'saude', difficulty: 'Platina', points: 700, requirements: ['21 dias de meditação'], earned: false },

  // === Segurança ===
  { id: 'guardiao_comunidade', title: 'Guardião da Comunidade', description: 'Reporte 5 situações à segurança', icon: 'shield-checkmark-outline', category: 'seguranca', difficulty: 'Prata', points: 300, requirements: ['5 reportes de segurança'], earned: false },
  { id: 'vigilante_noturno', title: 'Vigilante Noturno', description: 'Faça rondas noturnas por 10 dias', icon: 'moon-outline', category: 'seguranca', difficulty: 'Ouro', points: 500, requirements: ['10 rondas noturnas'], earned: false },

  // === Conquistas Secretas ===
  { id: 'explorador_secreto', title: '???', description: 'Conquista secreta - continue explorando!', icon: 'help-circle-outline', category: 'secreto', difficulty: 'Diamante', points: 1000, requirements: ['Descubra visitando todos os locais'], earned: false, secret: true },
  { id: 'lenda_viva', title: 'Lenda Viva', description: 'Complete 50 conquistas diferentes', icon: 'ribbon-outline', category: 'secreto', difficulty: 'Diamante', points: 2000, requirements: ['50 conquistas completadas'], earned: false },

  // === Família ===
  { id: 'familia_unida', title: 'Família Unida', description: 'Complete atividades com todos os dependentes', icon: 'people-circle-outline', category: 'familia', difficulty: 'Prata', points: 250, requirements: ['Atividade com cada dependente'], earned: false },
  { id: 'protetor_criancas', title: 'Protetor das Crianças', description: 'Leve crianças à Praça Infantil 20 vezes', icon: 'extension-puzzle-outline', category: 'familia', difficulty: 'Bronze', points: 150, requirements: ['20 visitas à Praça Infantil'], earned: false },

  // === Espiritualidade ===
  { id: 'peregrino', title: 'Peregrino', description: 'Visite a Capela 10 vezes', icon: 'home-outline', category: 'espiritualidade', difficulty: 'Bronze', points: 100, requirements: ['10 visitas à Capela'], earned: false },
  { id: 'alma_caridosa', title: 'Alma Caridosa', description: 'Participe de 5 ações solidárias', icon: 'heart-half-outline', category: 'espiritualidade', difficulty: 'Ouro', points: 400, requirements: ['5 ações solidárias'], earned: false }
];

// Atualizando também a lista de categorias para incluir todas as novas
export const CATEGORIES = [
    { id: 'all', name: 'Todas', icon: 'trophy-outline' as const },
    { id: 'limpeza', name: 'Limpeza', icon: 'sparkles-outline' as const },
    { id: 'sustentabilidade', name: 'Sustentabilidade', icon: 'leaf-outline' as const },
    { id: 'esportes', name: 'Esportes', icon: 'medal-outline' as const },
    { id: 'comunidade', name: 'Comunidade', icon: 'people-outline' as const },
    { id: 'transporte', name: 'Transporte', icon: 'bus-outline' as const },
    { id: 'educacao', name: 'Educação', icon: 'book-outline' as const },
    { id: 'saude', name: 'Saúde', icon: 'heart-outline' as const },
    { id: 'seguranca', name: 'Segurança', icon: 'shield-outline' as const },
    { id: 'familia', name: 'Família', icon: 'happy-outline' as const },
    { id: 'espiritualidade', name: 'Espiritual.', icon: 'moon-outline' as const },
    { id: 'secreto', name: 'Secretas', icon: 'lock-closed-outline' as const }
];