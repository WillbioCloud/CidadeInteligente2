// Define o formato de uma missão
export interface Mission {
  id: number;
  title: string;
  description: string;
  points: number;
  icon: string; // Emoji ou nome do ícone
  tasks: string[];
  category: 'limpeza' | 'sustentabilidade' | 'comunidade' | 'esporte' | 'bem-estar';
  // Opcional: define para quais loteamentos esta missão se aplica.
  loteamentoIds?: string[]; 
}

// Lista Mestra de Todas as Missões Possíveis
const ALL_MISSIONS: Mission[] = [
  // =================================================================
  // MISSÕES GERAIS (Para todos os loteamentos)
  // =================================================================
  { id: 1, title: 'Limpeza Matinal', description: 'Mantenha a frente do seu lote limpa hoje.', points: 20, icon: '🧹', category: 'limpeza', tasks: ['Varrer a calçada', 'Verificar se não há lixo espalhado'] },
  { id: 2, title: 'Separação do Lixo', description: 'Separe corretamente o lixo de hoje.', points: 15, icon: '♻️', category: 'sustentabilidade', tasks: ['Separar lixo orgânico do reciclável'] },
  { id: 3, title: 'Vizinhança Solidária', description: 'Interaja com seus vizinhos hoje.', points: 30, icon: '🤝', category: 'comunidade', tasks: ['Cumprimentar 3 vizinhos', 'Oferecer ajuda se necessário'] },
  { id: 4, title: 'Check-in de Segurança', description: 'Verifique se portões e janelas estão seguros.', points: 15, icon: '🛡️', category: 'comunidade', tasks: ['Conferir trancas ao sair', 'Conferir trancas antes de dormir'] },
  { id: 5, title: 'Economia de Energia', description: 'Desligue luzes e aparelhos não utilizados.', points: 20, icon: '💡', category: 'sustentabilidade', tasks: ['Apagar uma luz de um cômodo vazio', 'Tirar um aparelho da tomada'] },

  // =================================================================
  // MISSÕES EXCLUSIVAS: CIDADE INTELIGENTE
  // =================================================================
  { id: 101, title: 'Patrulha Anti-Dengue', description: 'Verifique possíveis focos de dengue no seu lote.', points: 35, icon: '🦟', category: 'limpeza', loteamentoIds: ['cidade_inteligente'], tasks: ['Verificar vasos de plantas', 'Limpar calhas'] },
  { id: 102, title: 'Conexão Coworking', description: 'Utilize o espaço de coworking do empreendimento.', points: 25, icon: '💼', category: 'comunidade', loteamentoIds: ['cidade_inteligente'], tasks: ['Realizar uma tarefa no coworking'] },
  
  // =================================================================
  // MISSÕES EXCLUSIVAS: CIDADE DAS FLORES
  // Baseado em: Praça, quadras (tênis e areia), horta, playground, lago, calçadão de caminhada.
  // =================================================================
  
  // -- Missões Diárias para Cidade das Flores --
  { id: 201, title: 'Passeio no Calçadão', description: 'Faça uma caminhada ou corrida no calçadão.', points: 25, icon: '👟', category: 'bem-estar', loteamentoIds: ['cidade_das_flores'], tasks: ['Completar 15 minutos de caminhada no calçadão'] },
  { id: 202, title: 'Rei da Quadra', description: 'Jogue uma partida na quadra de areia ou tênis.', points: 30, icon: '🏐', category: 'esporte', loteamentoIds: ['cidade_das_flores'], tasks: ['Jogar por 20 minutos em uma das quadras'] },
  { id: 203, title: 'Momento no Lago', description: 'Aprecie a vista do Lago das Flores por um momento.', points: 15, icon: '💧', category: 'bem-estar', loteamentoIds: ['cidade_das_flores'], tasks: ['Passar 5 minutos relaxando próximo ao lago'] },
  { id: 204, title: 'Dedos Verdes', description: 'Visite e ajude na horta comunitária.', points: 20, icon: '🥕', category: 'sustentabilidade', loteamentoIds: ['cidade_das_flores'], tasks: ['Regar uma parte da horta', 'Retirar uma erva daninha'] },
  { id: 205, title: 'Balanço Gigante', description: 'Tire uma foto no famoso Balanço Gigante.', points: 15, icon: '📸', category: 'comunidade', loteamentoIds: ['cidade_das_flores'], tasks: ['Visitar o balanço gigante'] },
  { id: 206, title: 'Hora do Play', description: 'Leve as crianças para brincar no playground.', points: 20, icon: '🧸', category: 'comunidade', loteamentoIds: ['cidade_das_flores'], tasks: ['Passar 15 minutos no playground'] },

  // -- Missões de Evolução para Cidade das Flores --
  { id: 501, title: 'Campeão de Areia', description: 'Organize um mini-torneio na quadra de areia.', points: 250, icon: '🏆', category: 'esporte', loteamentoIds: ['cidade_das_flores'], tasks: ['Convidar 3 vizinhos para jogar', 'Organizar 2 partidas diferentes'] },
  { id: 502, title: 'Guardião da Horta', description: 'Lidere uma iniciativa na horta comunitária.', points: 300, icon: '🧑‍🌾', category: 'sustentabilidade', loteamentoIds: ['cidade_das_flores'], tasks: ['Plantar uma nova hortaliça', 'Organizar um dia de colheita coletiva'] },
  { id: 503, title: 'Embaixador do Bem-Estar', description: 'Promova atividades saudáveis no loteamento.', points: 350, icon: '❤️', category: 'bem-estar', loteamentoIds: ['cidade_das_flores'], tasks: ['Criar um grupo de caminhada no calçadão', 'Organizar uma aula de yoga na praça'] },

];

// Função que o app irá chamar para pegar as missões do dia
export const getDailyMissionsForLoteamento = (loteamentoId: string): Mission[] => {
  // Filtra missões que são gerais OU específicas para o loteamento atual
  const filtered = ALL_MISSIONS.filter(mission => 
    !mission.loteamentoIds || mission.loteamentoIds.includes(loteamentoId)
  );
  
  // Embaralha e pega 3 missões para exibir
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

// Adicione aqui a lógica para Missões de Evolução se desejar
export const getLevelMissionsForLoteamento = (loteamentoId: string, userLevel: number): Mission[] => {
    // Filtra por nível e por loteamento
    const filtered = ALL_MISSIONS.filter(mission => 
        mission.category === 'esporte' || mission.category === 'manutencao' // Exemplo de filtro
        // Adicione a lógica de userLevel aqui
        // && mission.levelRequired <= userLevel 
        && (!mission.loteamentoIds || mission.loteamentoIds.includes(loteamentoId))
    );
    return filtered;
};