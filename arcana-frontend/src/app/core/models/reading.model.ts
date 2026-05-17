import { DrawnCard } from './card.model';

export interface Reading {
  id: string;
  user_id: string;
  question: string | null;
  spread_type: string;
  drawn_cards: DrawnCard[];
  created_at: string;
}

export interface ReadingCreate {
  question?: string;
  spread_type: string;
  drawn_cards: DrawnCard[];
}

export interface ReadingListOut {
  items: Reading[];
  total: number;
  page: number;
  page_size: number;
}
