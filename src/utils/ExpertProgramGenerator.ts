import { addDays, addWeeks, startOfToday, startOfWeek } from 'date-fns';

export interface WorkoutInterval {
  type: 'Warmup' | 'SteadyState' | 'Cooldown';
  duration: number; // En secondes
  powerLow: number;
  powerHigh?: number;
  cadence?: number;
}

export interface ScheduledWorkout {
  date: Date;
  type: 'Road' | 'Home-trainer';
  title: string;
  description: string;
  duration_minutes: number;
  intervals: WorkoutInterval[];
  is_recovery: boolean;
  phase: string;
  dayName: string;
  rpe: number;
}

// --- 1. MOTEUR HT1 : INTENSITÉS STRICTES ET DYNAMIQUES (EN SECONDES) ---
const getExpertHT1Workout = (rawProgramId: string, week: number, phase: string, ftp: number) => {
  const intervals: WorkoutInterval[] = [{ type: 'Warmup', duration: 900, powerLow: 0.5, powerHigh: 0.6, cadence: 95 }];

  const normalizedId = (rawProgramId || '').toLowerCase();
  const isFtpBoost = normalizedId.includes('boost');
  const isClimbing = normalizedId.includes('climb') || normalizedId.includes('grimpe');

  if (phase === 'RECUP') {
    intervals.push({ type: 'SteadyState', duration: 2400, powerLow: 0.53, cadence: 102 });
    return {
      title: `HT1: Vélocité Assimilation (W${week})`,
      description: `40min de balayage à ${Math.round(ftp * 0.53)}W à 102 RPM pour rincer les toxines.`,
      intervals,
      rpe: 3,
      duration_minutes: 55
    };
  }

  if (phase === 'TAPER') {
    intervals.push({ type: 'SteadyState', duration: 180, powerLow: 0.85, cadence: 95 });
    intervals.push({ type: 'SteadyState', duration: 45, powerLow: 1.3, cadence: 112 });
    intervals.push({ type: 'SteadyState', duration: 300, powerLow: 0.45 });
    return {
      title: `HT1: Affûtage Éveil Musculaire (W${week})`,
      description: `Rappel nerveux rapide. 45s à ${Math.round(ftp * 1.3)}W pour faire du jus.`,
      intervals,
      rpe: 4,
      duration_minutes: 23
    };
  }

  if (isFtpBoost || !isClimbing) {
    const cycleIndex = ((week - 1) % 3) + 1;

    if (cycleIndex === 1) {
      intervals.push({ type: 'SteadyState', duration: 480, powerLow: 0.84, cadence: 92 });
      intervals.push({ type: 'SteadyState', duration: 480, powerLow: 0.88, cadence: 90 });
      intervals.push({ type: 'SteadyState', duration: 480, powerLow: 0.92, cadence: 86 });
      intervals.push({ type: 'Cooldown', duration: 300, powerLow: 0.45 });
      return {
        title: `HT1: Rampe Sweet Spot (W${week})`,
        description: `24min en crescendo continu (de ${Math.round(ftp * 0.84)}W à ${Math.round(ftp * 0.92)}W) pour repousser le seuil.`,
        intervals,
        rpe: 7,
        duration_minutes: 44
      };
    }

    if (cycleIndex === 2) {
      for (let r = 0; r < 3; r++) {
        intervals.push({ type: 'SteadyState', duration: 60, powerLow: 1.12, cadence: 102 });
        intervals.push({ type: 'SteadyState', duration: 240, powerLow: 0.9, cadence: 88 });
        if (r < 2) intervals.push({ type: 'SteadyState', duration: 120, powerLow: 0.5, cadence: 95 });
      }
      intervals.push({ type: 'Cooldown', duration: 300, powerLow: 0.45 });
      return {
        title: `HT1: Seuil Over-Under (W${week})`,
        description: `3 séries de 5min alternant 1min sur-seuil (${Math.round(ftp * 1.12)}W) et 4min sous-seuil (${Math.round(ftp * 0.9)}W).`,
        intervals,
        rpe: 8,
        duration_minutes: 49
      };
    }

    for (let r = 0; r < 7; r++) {
      intervals.push({ type: 'SteadyState', duration: 120, powerLow: 0.95, cadence: 92 });
      intervals.push({ type: 'SteadyState', duration: 60, powerLow: 0.74, cadence: 90 });
    }
    intervals.push({ type: 'Cooldown', duration: 300, powerLow: 0.45 });
    return {
      title: `HT1: Seuil Intermittent 2/1 (W${week})`,
      description: `7 répétitions de 2min à ${Math.round(ftp * 0.95)}W coupées par 1min de transition active à ${Math.round(ftp * 0.74)}W.`,
      intervals,
      rpe: 8,
      duration_minutes: 41
    };
  }

  const climbTime = Math.min(10 + week * 1.5, 22);
  intervals.push({ type: 'SteadyState', duration: Math.round(climbTime * 60), powerLow: 0.83, cadence: 52 });
  intervals.push({ type: 'Cooldown', duration: 300, powerLow: 0.45 });
  return {
    title: `HT1: Force Spécifique Col (W${week})`,
    description: `Maintien de couple en côte : ${Math.round(climbTime)}min non-stop à ${Math.round(ftp * 0.83)}W à 52 RPM.`,
    intervals,
    rpe: 6,
    duration_minutes: Math.round((900 + climbTime * 60 + 300) / 60)
  };
};

// --- 2. MOTEUR HT2 : TECHNIQUE & CADENCE VARIÉE ---
const getExpertHT2Workout = (week: number, phase: string, ftp: number) => {
  const intervals: WorkoutInterval[] = [{ type: 'Warmup', duration: 900, powerLow: 0.5, powerHigh: 0.6, cadence: 90 }];

  if (phase === 'RECUP' || phase === 'TAPER') {
    intervals.push({ type: 'SteadyState', duration: 2400, powerLow: 0.56, cadence: 105 });
    return {
      title: `HT2: Souplesse Moteur (W${week})`,
      description: `Hyper-vélocité de 40min à ${Math.round(ftp * 0.56)}W à 105 RPM pour délier les fibres.`,
      intervals,
      rpe: 3,
      duration_minutes: 55
    };
  }

  const cycleIndex = ((week - 1) % 3) + 1;
  const targetPower = 0.63 + week * 0.005;

  if (cycleIndex === 1) {
    intervals.push({ type: 'SteadyState', duration: 300, powerLow: targetPower, cadence: 90 });
    intervals.push({ type: 'SteadyState', duration: 300, powerLow: targetPower, cadence: 100 });
    intervals.push({ type: 'SteadyState', duration: 300, powerLow: targetPower, cadence: 110 });
    intervals.push({ type: 'SteadyState', duration: 300, powerLow: targetPower, cadence: 100 });
    intervals.push({ type: 'SteadyState', duration: 300, powerLow: targetPower, cadence: 90 });
    intervals.push({ type: 'SteadyState', duration: 120, powerLow: 0.5 });
    intervals.push({ type: 'SteadyState', duration: 20, powerLow: 1.55, cadence: 115 });
    intervals.push({ type: 'Cooldown', duration: 160, powerLow: 0.45 });

    return {
      title: `HT2: Pyramide de Vélocité (W${week})`,
      description: `25min en continu à ${Math.round(ftp * targetPower)}W en faisant osciller les cadences (90 à 110 RPM) + 1 sprint de 20s.`,
      intervals,
      rpe: 5,
      duration_minutes: 52
    };
  }

  if (cycleIndex === 2) {
    for (let r = 0; r < 4; r++) {
      intervals.push({ type: 'SteadyState', duration: 360, powerLow: targetPower, cadence: 95 });
      intervals.push({ type: 'SteadyState', duration: 15, powerLow: 1.65, cadence: 42 });
      intervals.push({ type: 'SteadyState', duration: 105, powerLow: 0.5, cadence: 95 });
    }
    intervals.push({ type: 'Cooldown', duration: 120, powerLow: 0.45 });
    return {
      title: `HT2: Force & Sprints Isocinétiques (W${week})`,
      description: `4 blocs de 8min axés sur le rythme à ${Math.round(ftp * targetPower)}W brisés par des départs arrêtés de 15s sur gros braquet.`,
      intervals,
      rpe: 6,
      duration_minutes: 52
    };
  }

  for (let r = 0; r < 6; r++) {
    intervals.push({ type: 'SteadyState', duration: 180, powerLow: targetPower, cadence: 108 });
    intervals.push({ type: 'SteadyState', duration: 120, powerLow: 0.55, cadence: 85 });
  }
  intervals.push({ type: 'Cooldown', duration: 300, powerLow: 0.45 });
  return {
    title: `HT2: Intermittent Fast-Pedaling (W${week})`,
    description: `6 blocs de 3min à haute cadence (108 RPM) à ${Math.round(ftp * targetPower)}W alternés avec 2min de relâchement.`,
    intervals,
    rpe: 6,
    duration_minutes: 50
  };
};

// --- 3. CONFIGURATION DES SORTIES LONGUES (ROUTE) ---
const getExpertLongWorkout = (
  programId: string,
  week: number,
  phase: string,
  load: number,
  maxDuration: number,
  ftp: number
) => {
  const intervals: WorkoutInterval[] = [];

  let dur = maxDuration * load;
  if (phase === 'RECUP' || phase === 'TAPER') dur = maxDuration * 0.65;
  const durationMinutes = Math.round(dur);
  const tierMinutes = Math.round(durationMinutes / 3);

  if (phase === 'RECUP' || phase === 'TAPER') {
    intervals.push({ type: 'SteadyState', duration: durationMinutes * 60, powerLow: 0.6, cadence: 90 });
    return {
      title: `Foncier de Régulation (W${week})`,
      description: `Sortie d'assimilation tranquille de ${durationMinutes}min en Zone 2 basse à ${Math.round(ftp * 0.6)}W.`,
      intervals,
      rpe: 3,
      duration_minutes: durationMinutes
    };
  }

  const intensityBonus = week * 0.005;
  const normalizedId = (programId || '').toLowerCase();

  if (normalizedId.includes('climb')) {
    intervals.push({ type: 'SteadyState', duration: tierMinutes * 60, powerLow: 0.63 + intensityBonus, cadence: 90 });
    intervals.push({ type: 'SteadyState', duration: tierMinutes * 60, powerLow: 0.72 + intensityBonus, cadence: 85 });

    const thresholdDur = Math.min(6 + week * 1.5, 20);
    intervals.push({ type: 'SteadyState', duration: (tierMinutes - thresholdDur) * 60, powerLow: 0.65, cadence: 90 });
    intervals.push({ type: 'SteadyState', duration: thresholdDur * 60, powerLow: 0.91, cadence: 72 });

    return {
      title: `Foncier Escalade Évolutif (W${week})`,
      description: `Sortie de ${durationMinutes}min crescendo terminée par un col simulé fatigué de ${Math.round(thresholdDur)}min au seuil à ${Math.round(ftp * 0.91)}W.`,
      intervals,
      rpe: 6,
      duration_minutes: durationMinutes
    };
  } else {
    const p1 = 0.64 + intensityBonus;
    const p2 = 0.71 + intensityBonus;
    const p3 = 0.77 + intensityBonus;

    intervals.push({ type: 'SteadyState', duration: tierMinutes * 60, powerLow: p1, cadence: 94 });
    intervals.push({ type: 'SteadyState', duration: tierMinutes * 60, powerLow: p2, cadence: 90 });
    intervals.push({ type: 'SteadyState', duration: tierMinutes * 60, powerLow: p3, cadence: 86 });

    return {
      title: `Foncier Tri-Paliers Crescendo (W${week})`,
      description: `Foncier d'endurance de puissance de ${durationMinutes}min. Surcharge linéaire de rythme : ${Math.round(ftp * p1)}W ➔ ${Math.round(ftp * p2)}W ➔ ${Math.round(ftp * p3)}W.`,
      intervals,
      rpe: 5,
      duration_minutes: durationMinutes
    };
  }
};

// --- 4. ENGINE DE DISTRIBUTION PRINCIPAL ---
export const generateExpertCyclingPlan = (input: any): any[][] => {
  const today = startOfToday();
  const firstWeekStart = startOfWeek(today, { weekStartsOn: 1 });

  const duration = Number(input.durationWeeks) || 4;
  const restDays = input.restDays || [1, 5];
  const ftp = Number(input.ftp) || 200;
  const maxDuration = Number(input.maxDuration) || 120;

  const activeProgramId = input.programId || input.program_id || 'ftp-boost';
  const availableDayIndices = [1, 2, 3, 4, 5, 6, 0].filter(d => !restDays.includes(d));
  const plan = [];

  for (let i = 0; i < duration; i++) {
    const weekNum = i + 1;
    const weekStart = addWeeks(firstWeekStart, i);

    let phase = 'BASE';
    let loadFactor = 1.0;

    if (duration === 4) {
      if (weekNum === 1) {
        phase = 'BASE';
        loadFactor = 0.9;
      } else if (weekNum === 2) {
        phase = 'BUILD';
        loadFactor = 1.1;
      } else if (weekNum === 3) {
        phase = 'PEAK';
        loadFactor = 1.2;
      } else {
        phase = 'TAPER';
        loadFactor = 0.6;
      }
    } else if (duration === 8) {
      if (weekNum <= 3) {
        phase = 'BASE';
        loadFactor = 0.8 + weekNum * 0.1;
      } else if (weekNum === 4) {
        phase = 'RECUP';
        loadFactor = 0.6;
      } else if (weekNum <= 6) {
        phase = 'BUILD';
        loadFactor = 0.9 + (weekNum - 4) * 0.1;
      } else if (weekNum === 7) {
        phase = 'PEAK';
        loadFactor = 1.2;
      } else {
        phase = 'TAPER';
        loadFactor = 0.5;
      }
    } else {
      if (weekNum <= 3) {
        phase = 'BASE';
        loadFactor = 0.8 + weekNum * 0.07;
      } else if (weekNum === 4) {
        phase = 'RECUP';
        loadFactor = 0.55;
      } else if (weekNum <= 7) {
        phase = 'BUILD';
        loadFactor = 0.9 + (weekNum - 4) * 0.07;
      } else if (weekNum === 8) {
        phase = 'RECUP';
        loadFactor = 0.6;
      } else if (weekNum <= 11) {
        phase = 'PEAK';
        loadFactor = 1.18;
      } else {
        phase = 'TAPER';
        loadFactor = 0.5;
      }
    }

    const templates = [
      { id: 'long', type: 'Road' as const },
      { id: 'HT1', type: 'Home-trainer' as const },
      { id: 'HT2', type: 'Home-trainer' as const }
    ];

    const sessionsToPlace = templates.slice(0, availableDayIndices.length);
    let remainingDays = [...availableDayIndices];

    const weekWorkouts = sessionsToPlace.map(template => {
      let selectedDay =
        remainingDays.includes(0) && template.id === 'long'
          ? 0
          : (remainingDays.find(d => d !== 0) ?? remainingDays[0]);

      remainingDays = remainingDays.filter(d => d !== selectedDay);
      const sessionDate = addDays(weekStart, selectedDay === 0 ? 6 : selectedDay - 1);

      let data: any;

      if (template.id === 'long') {
        data = getExpertLongWorkout(activeProgramId, weekNum, phase, loadFactor, maxDuration, ftp);
      } else if (template.id === 'HT1') {
        data = getExpertHT1Workout(activeProgramId, weekNum, phase, ftp);
      } else {
        data = getExpertHT2Workout(weekNum, phase, ftp);
      }

      return {
        date: sessionDate,
        dayName: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][selectedDay],
        type: template.type,
        title: data.title,
        description: data.description,
        duration_minutes: data.duration_minutes,
        intervals: data.intervals,
        is_recovery: phase === 'RECUP',
        phase: phase, // Transmis directement
        rpe: data.rpe
      };
    });

    plan.push(weekWorkouts.sort((a, b) => a.date.getTime() - b.date.getTime()));
  }

  return plan;
};
