export type InjectionZone =
  | 'bras_droit'
  | 'ventre_hd'
  | 'ventre_hg'
  | 'ventre_bd'
  | 'ventre_bg'
  | 'cuisse_gauche'
  | 'cuisse_droite'
  | 'flanc_gauche'
  | 'flanc_droit';

export type ReactionType = 'aucune' | 'bleu' | 'douleur' | 'autre';

export interface ZoneData {
  id: InjectionZone;
  shortLabel: string;
  fullLabel: string;
  isRecent: boolean;
  daysAgo: number | null;
  emoji: string;
}

export interface InjectionEntry {
  id?: string;
  user_id?: string;
  injected_at: string;
  zone: InjectionZone;
  reaction_type: ReactionType;
  reaction_details?: string;
}

export const ZONES_CONFIG: ZoneData[] = [
  {
    id: 'bras_droit',
    shortLabel: 'Bras Droit',
    fullLabel: 'Bras Droit',
    isRecent: false,
    daysAgo: null,
    emoji: '💪'
  },
  {
    id: 'ventre_hd',
    shortLabel: 'Ventre HD',
    fullLabel: 'Ventre Haut Droit',
    isRecent: false,
    daysAgo: null,
    emoji: '↗️'
  },
  {
    id: 'ventre_hg',
    shortLabel: 'Ventre HG',
    fullLabel: 'Ventre Haut Gauche',
    isRecent: false,
    daysAgo: null,
    emoji: '↖️'
  },
  {
    id: 'ventre_bd',
    shortLabel: 'Ventre BD',
    fullLabel: 'Ventre Bas Droit',
    isRecent: false,
    daysAgo: null,
    emoji: '↘️'
  },
  {
    id: 'ventre_bg',
    shortLabel: 'Ventre BG',
    fullLabel: 'Ventre Bas Gauche',
    isRecent: false,
    daysAgo: null,
    emoji: '↙️'
  },
  {
    id: 'cuisse_gauche',
    shortLabel: 'Cuisse G',
    fullLabel: 'Cuisse Gauche',
    isRecent: false,
    daysAgo: null,
    emoji: '🦵'
  },
  {
    id: 'cuisse_droite',
    shortLabel: 'Cuisse D',
    fullLabel: 'Cuisse Droite',
    isRecent: false,
    daysAgo: null,
    emoji: '🦵'
  },
  {
    id: 'flanc_gauche',
    shortLabel: 'Flanc G',
    fullLabel: 'Flanc Gauche',
    isRecent: false,
    daysAgo: null,
    emoji: '🍮'
  },
  {
    id: 'flanc_droit',
    shortLabel: 'Flanc D',
    fullLabel: 'Flanc Droit',
    isRecent: false,
    daysAgo: null,
    emoji: '🍮'
  }
];