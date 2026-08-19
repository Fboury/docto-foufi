export interface BadgeConfig {
  key: string;
  title: string;
  description: string;
  emoji: string;
  repeatable?: boolean;
}

// 1. Jalons globaux (toutes les 50 injections jusqu'à 500)
const GLOBAL_MILESTONES = [
  { count: 1, title: 'Première étape', emoji: '🌱' },
  { count: 10, title: 'Cap des 10', emoji: '🎯' },
  { count: 50, title: 'Demi-centenaire (50)', emoji: '🏆' },
  { count: 100, title: 'Centurion (100)', emoji: '👑' },
  { count: 150, title: 'Pionnier (150)', emoji: '💎' },
  { count: 200, title: 'Bicentenaire (200)', emoji: '🔥' },
  { count: 250, title: 'Inoxydable (250)', emoji: '🛡️' },
  { count: 300, title: 'Maître du Temps (300)', emoji: '⚡' },
  { count: 350, title: 'Inébranlable (350)', emoji: '🌟' },
  { count: 400, title: 'Légende (400)', emoji: '🔱' },
  { count: 450, title: 'Titan (450)', emoji: '🌠' },
  { count: 500, title: 'Grand Maître (500)', emoji: '🌌' }
];

const globalBadges: BadgeConfig[] = GLOBAL_MILESTONES.map(m => ({
  key: `total_injections_${m.count}`,
  title: m.title,
  description: `Atteindre ${m.count} injection${m.count > 1 ? 's' : ''} enregistrée${m.count > 1 ? 's' : ''}`,
  emoji: m.emoji
}));

// 2. Jalons par zone (toutes les 25 injections jusqu'à 250)
const ZONE_MILESTONES = [25, 50, 75, 100, 125, 150, 175, 200, 225, 250];

const zoneBadges: BadgeConfig[] = ZONE_MILESTONES.map(count => ({
  key: `zone_master_${count}`,
  title: `Expert Zone (${count})`,
  description: `Atteindre ${count} piqûres sur une même zone`,
  emoji: count >= 100 ? '⭐' : '📍',
  repeatable: true
}));

// 3. Badges événementiels & dates spéciales
const eventBadges: BadgeConfig[] = [
  {
    key: 'christmas_injection',
    title: 'Esprit de Noël',
    description: 'Faire une injection le 25 décembre',
    emoji: '🎄',
    repeatable: true
  },
  {
    key: 'new_year_injection',
    title: 'Bonne Année',
    description: 'Faire une injection le 1er janvier',
    emoji: '🎆',
    repeatable: true
  },
  {
    key: 'halloween_injection',
    title: 'Halloween',
    description: 'Faire une injection le 31 octobre',
    emoji: '🎃',
    repeatable: true
  },
  {
    key: 'bahia_birthday_injection',
    title: 'Anniversaire Bahia',
    description: 'Faire une injection le 21 novembre',
    emoji: '🎂',
    repeatable: true
  },
  {
    key: 'partner_birthday_injection',
    title: 'Anniversaire Floflo',
    description: 'Faire une injection le 4 juillet',
    emoji: '🎁',
    repeatable: true
  },
  {
    key: 'couple_anniversary_injection',
    title: 'Mise en couple',
    description: 'Faire une injection le 1er décembre (2019)',
    emoji: '❤️',
    repeatable: true
  },
  {
    key: 'pacs_anniversary_injection',
    title: 'Anniversaire PACS',
    description: 'Faire une injection le 1er avril (2021)',
    emoji: '📜',
    repeatable: true
  },
  {
    key: 'engagement_anniversary_injection',
    title: 'Fiançailles',
    description: 'Faire une injection le 1er août (2026)',
    emoji: '💍',
    repeatable: true
  },
  {
    key: 'test',
    title: 'On teste les supers badges !',
    description: 'Parce que je sais que tu aimes bien ça !',
    emoji: '😘',
    repeatable: false
  }
];

export const ALL_BADGES: BadgeConfig[] = [...globalBadges, ...zoneBadges, ...eventBadges];
