export interface Mission {
  id: number;
  type: 'daily' | 'evolution';
  title: string;
  description: string;
  points: number;
  icon: string;
  tasks: string[];
}
