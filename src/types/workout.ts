export interface Interval {
  type: 'SteadyState' | 'Ramp' | 'FreeRide' | 'Cooldown' | 'Warmup';
  duration: number; // Toujours en secondes pour les exports
  powerLow: number; // En % de la FTP (ex: 0.85 pour 85%)
  powerHigh?: number; // Utile pour les montées en puissance (Ramp)
  cadence?: number;
}

export interface Workout {
  id?: string;
  userId: string;
  createdAt?: string;
  date: string;
  title: string;
  type: 'Home-trainer' | 'Road' | 'Strength';
  durationMinutes: number;
  powerAvg?: number;
  hrAvg?: number;
  cadenceAvg?: number;
  normalizedPower?: number; // Spécifique au vélo
  tss?: number;
  ftpTarget: number; // Important : la FTP de l'utilisateur au moment de la création
  intervals: Interval[];
  description: string;
}

export interface WorkoutDto {
  id?: string;
  user_id: string;
  createdAt?: string;
  date: string;
  title: string;
  type: 'Home-trainer' | 'Road' | 'Strength';
  duration_minutes: number;
  power_avg?: number;
  hr_avg?: number;
  cadence_avg?: number;
  normalized_power?: number; // Spécifique au vélo
  tss?: number;
  ftp_target: number; // Important : la FTP de l'utilisateur au moment de la
  // création
  intervals: Interval[];
  description: string;
}

export interface StrengthExercise {
  type: 'Strength';
  name: string;
  sets: number;
  reps: number;
  weight: number; // en kg
  description?: string;
}
