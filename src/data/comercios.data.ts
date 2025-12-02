// src/data/comercios.data.ts (VERSÃO FINAL E COMPLETA)

export interface Comercio {
  id: number;
  name: string;
  category: string;
  loteamento_id: string;
  city: string;
  status: 'Aberto' | 'Em Breve' | 'Fechado';
  logo: string;
  coverImage: string;
  videoUrl?: string;
  description: string;
  images: string[];
  contact: {
    whatsapp: string;
    instagram: string;
  };
  rating: number;
  featured: boolean;
  openingHours: string;
  services: string[];
}

// Dados de exemplo atualizados com todos os campos
export const comerciosData: Comercio[] = [
  {
    id: 1,
    name: 'Padaria Villa Real',
    category: 'Alimentação',
    loteamento_id: 'Cidade_Inteligente',
    city: 'Santo Antônio do Descoberto - GO',
    status: 'Aberto',
    logo: 'https://placehold.co/100x100/FFFFFF/333333?text=Logo',
    coverImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop',
    description: 'A Padaria Villa Real é tradição no loteamento há mais de 5 anos. Oferecemos produtos frescos diariamente, com uma variedade de pães artesanais, bolos caseiros e um delicioso café da manhã. Nossa equipe é especializada em produtos de panificação de alta qualidade.',
    images: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
    ],
    contact: {
      whatsapp: '62999990001',
      instagram: '@padariavillareal',
    },
    rating: 4.8,
    featured: true,
    openingHours: 'Segunda a Sábado: 6h às 19h | Domingo: 7h às 12h',
    services: ['Pães artesanais', 'Bolos e tortas', 'Café da manhã', 'Salgados', 'Delivery'],
  },
  {
    id: 2,
    name: 'Farmácia Saúde+',
    category: 'Saúde',
    loteamento_id: 'Cidade_Inteligente',
    city: 'Santo Antônio do Descoberto - GO',
    status: 'Aberto',
    logo: 'https://placehold.co/100x100/FFFFFF/333333?text=Logo',
    coverImage: 'https://images.unsplash.com/photo-1588200908342-23b585c03e26?w=600&h=400&fit=crop',
    description: 'Medicamentos, perfumaria e cuidados com a saúde. Atendimento especializado e entrega rápida para sua conveniência.',
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&h=300&fit=crop',
    ],
    contact: {
      whatsapp: '62999990002',
      instagram: '@farmaciasaudeplus',
    },
    rating: 4.6,
    featured: true,
    openingHours: 'Segunda a Sábado: 8h às 22h | Domingo: 9h às 20h',
    services: ['Medicamentos', 'Perfumaria', 'Suplementos', 'Entrega Rápida'],
  },
  {
    id: 3,
    name: 'Academia Corpo em Movimento',
    category: 'Saúde e Fitness',
    loteamento_id: 'Cidade_Inteligente',
    city: 'Caldas Novas - GO',
    status: 'Em Breve',
    logo: 'https://placehold.co/100x100/FFFFFF/333333?text=Logo',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
    description: 'Estrutura moderna e os melhores equipamentos para você cuidar da sua saúde e alcançar seus objetivos. Inauguração em breve!',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&h=300&fit=crop',
    ],
    contact: {
      whatsapp: '5562911112222',
      instagram: '@academiacorpoemmovimento',
    },
    rating: 0,
    featured: false,
    openingHours: 'Em breve',
    services: ['Musculação', 'Aulas Coletivas', 'Spinning', 'Personal Trainer'],
  },
];