import {
  addDays,
  addWeeks,
  differenceInWeeks,
  parseISO,
  startOfToday,
  startOfWeek
} from 'date-fns';

export interface WorkoutInterval {
  type: 'Warmup' | 'SteadyState' | 'Cooldown';
  duration: number;
  powerLow: number;
  powerHigh: number;
  cadence?: number;
}

export interface ProgramInput {
  targetDate: string;
  ftp: number;
  maxDuration: number;
  restDays: number[];
  programId: string;
}

export interface ScheduledWorkout {
  date: Date;
  type: 'Road' | 'Home-trainer';
  title: string;
  description: string;
  duration_minutes: number;
  intervals: WorkoutInterval[];
  is_recovery: boolean;
  dayName: string;
  rpe: number;
}

const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// --- FONCTIONS DE GÉNÉRATION DE CONTENU ---

const getQualitativeWorkout = (
  input: ProgramInput,
  i: number,
  isRecovery: boolean,
  cycleIndex: number,
  isTapering: boolean
) => {
  let intervals: WorkoutInterval[] = [{ type: 'Warmup', duration: 900, powerLow: 0.45, powerHigh: 0.55, cadence: 90 }];
  let rpe = 7;

  switch (input.programId) {
    case 'ftp-boost':
      // Augmentation de 2% de l'intensité cible à chaque cycle de 4 semaines
      const target = 0.88 + cycleIndex * 0.02;
      let blockDur = isRecovery ? 10 : 10 + (i % 4) * 2;
      if (isTapering) blockDur = Math.round(blockDur * 0.6);
      rpe = isRecovery ? 5 : 8;

      for (let r = 0; r < (isRecovery ? 2 : 3); r++) {
        intervals.push({
          type: 'SteadyState',
          duration: blockDur * 60,
          powerLow: target,
          powerHigh: target,
          cadence: 95
        });
        if (r < 2) intervals.push({ type: 'SteadyState', duration: 180, powerLow: 0.5, powerHigh: 0.5, cadence: 85 });
      }
      return {
        title: `Sweet Spot C${cycleIndex + 1}`,
        description: `Développement du seuil. Cible : ${Math.round(target * 100)}% FTP. Focus force aérobie.`,
        intervals,
        rpe
      };

    case 'climbing-pro':
      // Ajout d'une répétition par cycle pour la progression de la force
      let reps = isRecovery ? 3 : 4 + (i % 4) + cycleIndex;
      if (isTapering) reps = Math.max(2, Math.round(reps * 0.5));
      const pClimb = 0.8 + cycleIndex * 0.02;
      rpe = isRecovery ? 5 : 8;

      for (let r = 0; r < reps; r++) {
        intervals.push({ type: 'SteadyState', duration: 300, powerLow: pClimb, powerHigh: pClimb, cadence: 50 });
        intervals.push({ type: 'SteadyState', duration: 120, powerLow: 0.55, powerHigh: 0.55, cadence: 100 });
      }
      return {
        title: `Force Grimpeur C${cycleIndex + 1}`,
        description: `${reps} x 5min à 50 RPM. Travail de couple spécifique pour la montagne.`,
        intervals,
        rpe
      };

    default:
      // Endurance Technique
      intervals = [{ type: 'Warmup', duration: 600, powerLow: 0.45, powerHigh: 0.6, cadence: 90 }];
      for (let r = 0; r < 3; r++) {
        intervals.push({ type: 'SteadyState', duration: 60, powerLow: 0.55, powerHigh: 0.55, cadence: 80 });
        intervals.push({ type: 'SteadyState', duration: 60, powerLow: 0.55, powerHigh: 0.55, cadence: 80 });
        intervals.push({ type: 'SteadyState', duration: 120, powerLow: 0.7, powerHigh: 0.7, cadence: 110 });
      }
      const steps = isRecovery ? 2 : 4;
      for (let s = 0; s < steps; s++) {
        const p = 0.65 + s * 0.03 + cycleIndex * 0.01;
        intervals.push({ type: 'SteadyState', duration: 300, powerLow: p, powerHigh: p, cadence: 100 - s * 5 });
      }
      intervals.push({ type: 'Cooldown', duration: 300, powerLow: 0.55, powerHigh: 0.45 });
      return {
        title: 'Endurance Technique',
        description: 'Travail de fluidité : jambe isolée et pyramide de cadence.',
        intervals,
        rpe: 5
      };
  }
};

const getAgilityWorkout = (isRecovery: boolean, cycleIndex: number, isTapering: boolean) => {
  const intervals: WorkoutInterval[] = [{ type: 'Warmup', duration: 600, powerLow: 0.45, powerHigh: 0.55 }];
  let segments = isRecovery ? 3 : 5;
  if (isTapering) segments = 2;

  for (let s = 0; s < segments; s++) {
    const p = 0.62 + s * 0.01 + cycleIndex * 0.01;
    intervals.push({ type: 'SteadyState', duration: 300, powerLow: p, powerHigh: p, cadence: s % 2 === 0 ? 98 : 82 });
    if (!isRecovery && !isTapering && s % 2 === 0) {
      intervals.push({ type: 'SteadyState', duration: 10, powerLow: 1.4, powerHigh: 1.4, cadence: 115 });
      intervals.push({ type: 'SteadyState', duration: 50, powerLow: 0.5, powerHigh: 0.5, cadence: 85 });
    }
  }
  intervals.push({ type: 'Cooldown', duration: 600, powerLow: 0.55, powerHigh: 0.4 });
  return {
    title: 'Endurance & Agilité',
    description: 'Variations de cadence et micro-sprints pour stimuler les fibres nerveuses.',
    intervals,
    rpe: 4
  };
};

const getLongWorkout = (
  input: ProgramInput,
  i: number,
  isRecovery: boolean,
  cycleIndex: number,
  isTapering: boolean
) => {
  let durMin = input.maxDuration + (i % 4) * 15 + cycleIndex * 20;
  if (isRecovery) durMin = Math.round(durMin * 0.65);
  if (isTapering) durMin = Math.round(input.maxDuration * 0.6);

  return {
    title: isTapering ? 'Affûtage Pré-Objectif' : `Volume Fondamental C${cycleIndex + 1}`,
    description: `Sortie longue d'endurance stable. Restez en Zone 2.`,
    intervals: [
      {
        type: 'SteadyState',
        duration: durMin * 60,
        powerLow: 0.65 + cycleIndex * 0.01,
        powerHigh: 0.65 + cycleIndex * 0.01
      }
    ],
    duration_minutes: durMin,
    rpe: isRecovery || isTapering ? 3 : 5
  };
};

const getBaseWorkout = (cycleIndex: number) => ({
  title: 'Base Aérobie',
  description: `Volume complémentaire. Cycle ${cycleIndex + 1}.`,
  intervals: [{ type: 'SteadyState', duration: 2400 + cycleIndex * 300, powerLow: 0.6, powerHigh: 0.6, cadence: 90 }],
  rpe: 3
});

// --- GÉNÉRATEUR PRINCIPAL ---
export const generateCyclingPlan = (input: ProgramInput): ScheduledWorkout[][] => {
  const today = startOfToday();
  const targetDate = parseISO(input.targetDate);
  const numberOfWeeks = Math.max(differenceInWeeks(targetDate, today) + 1, 1);
  const firstWeekStart = startOfWeek(today, { weekStartsOn: 1 });

  // Jours disponibles (0 = Dimanche, 1-6 = Lun-Sam)
  const availableDayIndices = [1, 2, 3, 4, 5, 6, 0].filter(d => !input.restDays.includes(d));

  return Array.from({ length: numberOfWeeks }, (_, i) => {
    const weekIndex = i + 1;
    const weekStart = addWeeks(firstWeekStart, i);
    const isRecovery = weekIndex % 4 === 0;
    const isTapering = weekIndex === numberOfWeeks && numberOfWeeks > 2;
    const cycleIndex = Math.floor(i / 4);

    // 1. Définir les séances à placer par ordre de priorité
    const templates = [
      { id: 'long', type: 'Road' as const },
      { id: 'qualitative', type: 'Home-trainer' as const },
      { id: 'agility', type: 'Home-trainer' as const },
      { id: 'base', type: 'Home-trainer' as const },
      { id: 'base2', type: 'Home-trainer' as const }
    ];

    // On ne garde que ce qu'on peut caser
    const sessionsToPlace = templates.slice(0, availableDayIndices.length);

    // 2. Créer une copie des jours dispos pour les consommer
    let remainingDays = [...availableDayIndices];

    const weekWorkouts = sessionsToPlace.map(template => {
      let selectedDay: number;

      // LOGIQUE DE PLACEMENT SPÉCIFIQUE
      if (template.id === 'long' && remainingDays.includes(0)) {
        // Si c'est la sortie longue et que le Dimanche est libre -> On prend le Dimanche
        selectedDay = 0;
      } else {
        // Sinon, on prend le premier jour disponible restant (en évitant le dimanche si possible pour le reste)
        // On trie pour ne pas mettre de la haute intensité juste après la sortie longue si possible
        selectedDay = remainingDays.find(d => d !== 0) ?? remainingDays[0];
      }

      // On retire le jour choisi des jours dispos pour cette semaine
      remainingDays = remainingDays.filter(d => d !== selectedDay);

      const sessionDate = addDays(weekStart, selectedDay === 0 ? 6 : selectedDay - 1);

      // Génération du contenu (identique à avant)
      let data: any;
      if (template.id === 'long') data = getLongWorkout(input, i, isRecovery, cycleIndex, isTapering);
      else if (template.id === 'qualitative')
        data = getQualitativeWorkout(input, i, isRecovery, cycleIndex, isTapering);
      else if (template.id === 'agility') data = getAgilityWorkout(isRecovery, cycleIndex, isTapering);
      else data = getBaseWorkout(cycleIndex);

      const duration =
        data.duration_minutes ||
        Math.round(data.intervals.reduce((acc: number, curr: any) => acc + curr.duration, 0) / 60);

      return {
        date: sessionDate,
        dayName: DAY_NAMES[selectedDay],
        type: template.type,
        title: data.title,
        description: data.description,
        duration_minutes: duration,
        intervals: data.intervals,
        is_recovery: isRecovery,
        rpe: data.rpe
      };
    });

    // Toujours trier par date pour que la preview soit propre
    return weekWorkouts.sort((a, b) => a.date.getTime() - b.date.getTime());
  });
};
