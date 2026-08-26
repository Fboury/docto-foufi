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

  // --- JALONS PAR ZONE (Tous les 10) ---
  {
    key: 'zone_master_10',
    title: 'Habitué d’une Zone',
    description: '10 injections dans la même zone',
    emoji: '🎯'
  },
  {
    key: 'zone_master_20',
    title: 'Fidèle d’une Zone',
    description: '20 injections dans la même zone',
    emoji: '📌'
  },
  {
    key: 'zone_master_30',
    title: 'Expert d’une Zone',
    description: '30 injections dans la même zone',
    emoji: '🏅'
  },
  {
    key: 'zone_master_40',
    title: 'Pilier d’une Zone',
    description: '40 injections dans la même zone',
    emoji: '⚡'
  },
  {
    key: 'zone_master_50',
    title: 'Roi d’une Zone',
    description: '50 injections dans la même zone',
    emoji: '👑'
  },
  {
    key: 'zone_master_60',
    title: 'Maître d’une Zone',
    description: '60 injections dans la même zone',
    emoji: '🔱'
  },
  {
    key: 'zone_master_70',
    title: 'Inoxydable',
    description: '70 injections dans la même zone',
    emoji: '🛡️'
  },
  {
    key: 'zone_master_80',
    title: 'Légende d’une Zone',
    description: '80 injections dans la même zone',
    emoji: '🔥'
  },
  {
    key: 'zone_master_90',
    title: 'Imperturbable',
    description: '90 injections dans la même zone',
    emoji: '🔮'
  },
  {
    key: 'zone_master_100',
    title: 'Centurion de Zone',
    description: '100 injections dans la même zone',
    emoji: '💯'
  },
  {
    key: 'zone_master_110',
    title: 'Invincible',
    description: '110 injections dans la même zone',
    emoji: '🦾'
  },
  {
    key: 'zone_master_120',
    title: 'Inébranlable',
    description: '120 injections dans la même zone',
    emoji: '💎'
  },
  {
    key: 'zone_master_130',
    title: 'Vétéran de Zone',
    description: '130 injections dans la même zone',
    emoji: '🎖️'
  },
  {
    key: 'zone_master_140',
    title: 'Suprématie',
    description: '140 injections dans la même zone',
    emoji: '🌌'
  },
  {
    key: 'zone_master_150',
    title: 'Maître Suprême de Zone',
    description: '150 injections dans la même zone',
    emoji: '🌟'
  },
  {
    key: 'zone_master_160',
    title: 'Titan de Zone',
    description: '160 injections dans la même zone',
    emoji: '🏛️'
  },
  {
    key: 'zone_master_170',
    title: 'Inaltérable',
    description: '170 injections dans la même zone',
    emoji: '✨'
  },
  {
    key: 'zone_master_180',
    title: 'Seigneur de Zone',
    description: '180 injections dans la même zone',
    emoji: '⚜️'
  },
  {
    key: 'zone_master_190',
    title: 'Monolithe',
    description: '190 injections dans la même zone',
    emoji: '🗿'
  },
  {
    key: 'zone_master_200',
    title: 'Légende Absolue',
    description: '200 injections dans la même zone !',
    emoji: '🌠'
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
