export interface PersonalRecord {
  name: string;
  maxValue: number; // Sera soit des kg, soit des secondes
  mode: 'weight' | 'time';
  date: string;
  lastReps?: number; // Optionnel (uniquement pour le mode weight)
}
