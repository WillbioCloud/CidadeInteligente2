export interface LevelData {
  name: string;
  icon: string;
  pointsRequired: number;
  benefits: string[];
  nextLevelRequirements: string[]; // GARANTIR QUE ESTÁ NA INTERFACE
}

export const LEVELS_DATA: { [key: number]: LevelData } = {
  1: { name: "Novo Morador", icon: "home-outline", pointsRequired: 0, benefits: ["Acesso às missões diárias básicas."], nextLevelRequirements: ["Alcançar 750 pontos.", "Completar 15 missões diárias."] },
  2: { name: "Vizinho Engajado", icon: "chatbubbles-outline", pointsRequired: 750, benefits: ["Desbloqueia Missões de Evolução.", "Bônus de 5% em pontos de comunidade."], nextLevelRequirements: ["Alcançar 2.500 pontos.", "Completar a missão 'Guardião do Lote'."] },
  3: { name: "Vizinho Ativo", icon: "walk-outline", pointsRequired: 2500, benefits: ["Prioridade no agendamento de quadras.", "Acesso a conquistas de nível Prata."], nextLevelRequirements: ["Alcançar 7.000 pontos.", "Completar a missão 'Eco Proprietário'."] },
  4: { name: "Líder Comunitário", icon: "trophy-outline", pointsRequired: 7000, benefits: ["Pode propor eventos para a comunidade.", "Bônus de 10% em todas as missões."], nextLevelRequirements: ["Alcançar 15.000 pontos.", "Obter 5 conquistas de Ouro."] },
  // GARANTIR QUE O ÚLTIMO NÍVEL TAMBÉM TENHA A PROPRIEDADE
  5: { name: "Mestre do Bairro", icon: "key-outline", pointsRequired: 15000, benefits: ["Chave simbólica da cidade em eventos.", "Acesso a todas as conquistas secretas."], nextLevelRequirements: ["Você alcançou o topo! Continue sendo uma inspiração."] }
};