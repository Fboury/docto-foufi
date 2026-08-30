export interface LevelInfo {
  level: number;
  currentXP: number;
  xpForNextLevel: number;
  progressPercent: number;
  title: string;
}

export const XP_PER_INJECTION = 100;
export const XP_PER_BADGE = 50; // Bonus d'XP par badge

// DATE DE DÉBUT DE LA GAMIFICATION
export const GAMIFICATION_START_DATE = new Date('2026-08-30T14:00:00');

const LEVEL_TITLES: Record<number, string> = {
  1: 'Débutante',
  2: 'Apprentie',
  4: 'Habituée',
  7: 'Régulière',
  10: 'Experte de la Pompe',
  15: 'Maître de la Discipline',
  20: 'Gardienne du Rituel',
  30: 'Légende Inoxydable',
  50: 'Guerrière Céleste'
};

const getXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.25)) + 50;
};

// Helper pour calculer les clés de badges débloqués sur l'historique filtré
const getUnlockedKeysFromInjections = (items: any[]): string[] => {
  const keys: string[] = [];
  const total = items.length;

  if (total === 0) return keys;

  const GLOBAL_STEPS = [1, 10, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
  GLOBAL_STEPS.forEach(step => {
    if (total >= step) keys.push(`total_injections_${step}`);
  });

  const zoneCounts: Record<string, number> = {};
  items.forEach(i => {
    if (i.zone) zoneCounts[i.zone] = (zoneCounts[i.zone] || 0) + 1;
  });

  const ZONE_STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];
  ZONE_STEPS.forEach(step => {
    if (Object.values(zoneCounts).some(count => count >= step)) {
      keys.push(`zone_master_${step}`);
    }
  });

  items.forEach(i => {
    if (!i.injected_at) return;
    const d = new Date(i.injected_at);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours();
    const dayOfWeek = d.getDay();

    if (hour >= 6 && hour < 9) keys.push('early_bird');
    if (hour >= 22 || hour < 2) keys.push('night_owl');
    if (dayOfWeek === 0 || dayOfWeek === 6) keys.push('weekend_warrior');

    if (month === 2 && day === 14) keys.push('valentines_day');
    if (month === 3 && day === 21) keys.push('spring_injection');
    if (month === 6 && day === 21) keys.push('summer_vibes');
    if (month === 9 && day === 21) keys.push('autumn_injection');
    if (month === 12 && day === 25) keys.push('christmas_injection');
    if (month === 1 && day === 1) keys.push('new_year_injection');
    if (month === 10 && day === 31) keys.push('halloween_injection');

    if (month === 11 && day === 21) keys.push('bahia_birthday_injection');
    if (month === 7 && day === 4) keys.push('partner_birthday_injection');
    if (month === 12 && day === 1) keys.push('couple_anniversary_injection');
    if (month === 4 && day === 1) keys.push('pacs_anniversary_injection');
    if (month === 8 && day === 1) keys.push('engagement_anniversary_injection');
    if (month === 8 && day === 19) keys.push('test');
  });

  return Array.from(new Set(keys));
};

export const calculateLevel = (totalInjectionsInput: number | any[]): LevelInfo => {
  let validInjections: any[] = [];

  if (Array.isArray(totalInjectionsInput)) {
    validInjections = totalInjectionsInput.filter(injection => {
      if (!injection?.injected_at) return false;
      const injectionDate = new Date(injection.injected_at);
      return injectionDate >= GAMIFICATION_START_DATE;
    });
  }

  const injectionXP = validInjections.length * XP_PER_INJECTION;

  // Calcul du nombre de badges débloqués depuis la date de démarrage
  const unlockedKeys = getUnlockedKeysFromInjections(validInjections);
  const badgeXP = unlockedKeys.length * XP_PER_BADGE;

  const totalXP = injectionXP + badgeXP;

  let level = 1;
  let xpAccumulated = 0;
  let xpForNextLevel = getXPForLevel(1);

  while (totalXP >= xpAccumulated + xpForNextLevel) {
    xpAccumulated += xpForNextLevel;
    level++;
    xpForNextLevel = getXPForLevel(level);
  }

  const currentXPInLevel = totalXP - xpAccumulated;
  const progressPercent = Math.min(100, Math.round((currentXPInLevel / xpForNextLevel) * 100));

  const levelKeys = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a);
  const titleKey = levelKeys.find(k => level >= k) || 1;
  const title = LEVEL_TITLES[titleKey];

  return {
    level,
    currentXP: currentXPInLevel,
    xpForNextLevel,
    progressPercent,
    title
  };
};
