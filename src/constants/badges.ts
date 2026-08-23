export interface BadgeConfig {
  key: string;
  title: string;
  description: string;
  emoji: string;
}

export const ALL_BADGES: BadgeConfig[] = [
  // --- TEST ---
  {
    key: 'test',
    title: 'Test',
    description: 'Bip bip boop',
    emoji: '🤖'
  },

  // --- JALONS GLOBAUX ---
  {
    key: 'total_injections_1',
    title: 'Premier Pas',
    description: 'Première injection enregistrée',
    emoji: '🌱'
  },
  {
    key: 'total_injections_10',
    title: 'Dizaine',
    description: '10 injections effectuées',
    emoji: '🔟'
  },
  {
    key: 'total_injections_50',
    title: 'Cinquante',
    description: '50 injections effectuées',
    emoji: '🏅'
  },
  {
    key: 'total_injections_100',
    title: 'Centenaire',
    description: '100 injections effectuées !',
    emoji: '💯'
  },
  {
    key: 'total_injections_150',
    title: '150 Injections',
    description: '150 injections effectuées',
    emoji: '🚀'
  },
  {
    key: 'total_injections_200',
    title: '200 Injections',
    description: '200 injections effectuées',
    emoji: '⭐'
  },
  {
    key: 'total_injections_250',
    title: '250 Injections',
    description: '250 injections effectuées',
    emoji: '🌟'
  },
  {
    key: 'total_injections_300',
    title: '300 Injections',
    description: '300 injections effectuées',
    emoji: '👑'
  },
  {
    key: 'total_injections_350',
    title: '350 Injections',
    description: '350 injections effectuées',
    emoji: '🏆'
  },
  {
    key: 'total_injections_400',
    title: '400 Injections',
    description: '400 injections effectuées',
    emoji: '💎'
  },
  {
    key: 'total_injections_450',
    title: '450 Injections',
    description: '450 injections effectuées',
    emoji: '🔥'
  },
  {
    key: 'total_injections_500',
    title: 'Maître Suprême',
    description: '500 injections effectuées !',
    emoji: '🌌'
  },

  // --- JALONS PAR ZONE ---
  {
    key: 'zone_master_25',
    title: 'Expert d’une Zone',
    description: '25 injections dans la même zone',
    emoji: '🎯'
  },
  {
    key: 'zone_master_50',
    title: 'Roi d’une Zone',
    description: '50 injections dans la même zone',
    emoji: '👑'
  },
  {
    key: 'zone_master_75',
    title: 'Légende d’une Zone',
    description: '75 injections dans la même zone',
    emoji: '🔥'
  },
  {
    key: 'zone_master_100',
    title: 'Inoxydable',
    description: '100 injections dans la même zone',
    emoji: '🛡️'
  },
  {
    key: 'zone_master_125',
    title: 'Imperturbable',
    description: '125 injections dans la même zone',
    emoji: '⚡'
  },
  {
    key: 'zone_master_150',
    title: 'Invincible',
    description: '150 injections dans la même zone',
    emoji: '🦾'
  },
  {
    key: 'zone_master_175',
    title: 'Inoxydable II',
    description: '175 injections dans la même zone',
    emoji: '🔮'
  },
  {
    key: 'zone_master_200',
    title: 'Maître des Zones',
    description: '200 injections dans la même zone',
    emoji: '🌠'
  },
  {
    key: 'zone_master_225',
    title: 'Vétéran',
    description: '225 injections dans la même zone',
    emoji: '🎖️'
  },
  {
    key: 'zone_master_250',
    title: 'Suprématie',
    description: '250 injections dans la même zone',
    emoji: '👑'
  },

  // --- HABITUDES & MOMENTS DE LA JOURNÉE ---
  {
    key: 'early_bird',
    title: 'Lève-Tôt',
    description: 'Injection réalisée tôt le matin (entre 6h et 9h)',
    emoji: '🌅'
  },
  {
    key: 'night_owl',
    title: 'Oiseau de Nuit',
    description: 'Injection réalisée tard le soir (entre 22h et 2h)',
    emoji: '🦉'
  },
  {
    key: 'weekend_warrior',
    title: 'Changement du Weekend',
    description: 'Injection effectuée un samedi ou un dimanche',
    emoji: '☕'
  },

  // --- ÉVÉNEMENTS & DATES SPÉCIALES ---
  {
    key: 'valentines_day',
    title: 'Plein Cœur',
    description: 'Injection effectuée le 14 février (Saint-Valentin)',
    emoji: '💖'
  },
  {
    key: 'spring_injection',
    title: 'Printemps Médical',
    description: 'Injection effectuée le 21 mars',
    emoji: '🌸'
  },
  {
    key: 'summer_vibes',
    title: 'Injection Estivale',
    description: 'Injection effectuée le 21 juin (Fête de la Musique / Été)',
    emoji: '☀️'
  },
  {
    key: 'autumn_injection',
    title: 'Feuilles d’Automne',
    description: 'Injection effectuée le 21 septembre',
    emoji: '🍂'
  },
  {
    key: 'halloween_injection',
    title: 'Des Bonbons ou une Piqûre',
    description: 'Injection le jour d’Halloween',
    emoji: '🎃'
  },

  // --- DATES SPÉCIALES BAHIA & ENGAGEMENTS ---
  {
    key: 'bahia_birthday_injection',
    title: 'Joyeux Anniversaire Bahia !',
    description: 'Injection le jour de l’anniversaire de Bahia (21 nov.)',
    emoji: '🎂'
  },
  {
    key: 'partner_birthday_injection',
    title: 'Anniversaire du Chéri',
    description: 'Injection le jour de l’anniversaire de ton chéri (4 juil.)',
    emoji: '🎁'
  },
  {
    key: 'couple_anniversary_injection',
    title: 'Anniversaire de Rencontre',
    description: 'Injection le jour de votre anniversaire de rencontre (1er déc.)',
    emoji: '❤️'
  },
  {
    key: 'pacs_anniversary_injection',
    title: 'Anniversaire du PACS',
    description: 'Injection le jour de votre anniversaire de PACS (1er avr.)',
    emoji: '📜'
  },
  {
    key: 'engagement_anniversary_injection',
    title: 'Anniversaire des Fiançailles',
    description: 'Injection le jour de vos fiançailles (1er août)',
    emoji: '💍'
  },
  {
    key: 'christmas_injection',
    title: 'Magie de Noël',
    description: 'Injection le jour de Noël',
    emoji: '🎄'
  },
  {
    key: 'new_year_injection',
    title: 'Bonne Année !',
    description: 'Injection le 1er jour de l’année',
    emoji: '🎆'
  }
];
