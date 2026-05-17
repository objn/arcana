export interface TarotCard {
  card_id: string;
  name: string;
  number: string;
  suit: 'major' | 'cups' | 'wands' | 'swords' | 'pentacles';
  element?: string;
  theme?: string;
  keywords_up: string[];
  keywords_rev: string[];
  meaning_up: string;
  meaning_rev: string;
}

export interface DrawnCard {
  card_id: string;
  position: string;
  reversed: boolean;
}

export const SPREAD_CONFIGS: Record<string, { label: string; size: number; positions: string[] }> = {
  single: {
    label: 'Single Card',
    size: 1,
    positions: ['Present'],
  },
  three_card: {
    label: 'Past · Present · Future',
    size: 3,
    positions: ['Past', 'Present', 'Future'],
  },
  horseshoe: {
    label: 'Horseshoe (7 Cards)',
    size: 7,
    positions: ['Past', 'Present', 'Hidden Influences', 'Obstacles', 'External Influences', 'Hopes & Fears', 'Outcome'],
  },
  celtic_cross: {
    label: 'Celtic Cross (10 Cards)',
    size: 10,
    positions: ['Present', 'Challenge', 'Root', 'Past', 'Potential', 'Near Future', 'Self', 'External', 'Hopes & Fears', 'Outcome'],
  },
};
