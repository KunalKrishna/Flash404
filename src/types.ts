export interface HTTPStatusCode {
  code: number;
  title: string;
  description: string;
}

export interface SRSCard {
  code: number;
  level: number; // 0 to 5
  nextReview: number; // timestamp
}

export interface SRSState {
  cards: Record<number, SRSCard>;
}

export type View = 'dashboard' | 'study' | 'list';

export type Difficulty = 'again' | 'hard' | 'good' | 'easy';
