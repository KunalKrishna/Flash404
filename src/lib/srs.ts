import { SRSState, SRSCard, Difficulty } from "../types";
import { HTTP_STATUS_CODES } from "../constants";

const STORAGE_KEY = "http_status_master_srs";

export const INTERVALS = [0, 1, 3, 7, 14, 28]; // Days (approx weekly progression)

export function getInitialState(): SRSState {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse SRS state", e);
    }
  }

  // Initial state: all cards at level 0, next review now
  const initialCards: Record<number, SRSCard> = {};
  HTTP_STATUS_CODES.forEach((status) => {
    initialCards[status.code] = {
      code: status.code,
      level: 0,
      nextReview: Date.now(),
    };
  });

  return { cards: initialCards };
}

export function saveState(state: SRSState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function updateCard(state: SRSState, code: number, difficulty: Difficulty): SRSState {
  const card = state.cards[code];
  if (!card) return state;

  let newLevel = card.level;
  switch (difficulty) {
    case 'again':
      newLevel = 1;
      break;
    case 'hard':
      newLevel = card.level === 0 ? 1 : card.level; // Stays at current level if known, or goes to 1
      break;
    case 'good':
      newLevel = Math.min(card.level + 1, INTERVALS.length - 1);
      if (card.level === 0) newLevel = 2; // Jump slightly if "Good" on new card
      break;
    case 'easy':
      newLevel = Math.min(card.level + 2, INTERVALS.length - 1);
      if (card.level === 0) newLevel = 3; // Fast track if "Easy" on new card
      break;
  }

  const daysUntilNext = INTERVALS[newLevel];
  // If "again", we want it back in the same session ideally, but for now we'll do 1h or just 1 day
  const buffer = difficulty === 'again' ? 60000 : 0; // 1 min buffer if again so it appears at end of session
  const nextReview = Date.now() + daysUntilNext * 24 * 60 * 60 * 1000 + buffer;

  const newState = {
    ...state,
    cards: {
      ...state.cards,
      [code]: {
        ...card,
        level: newLevel,
        nextReview,
      },
    },
  };

  saveState(newState);
  return newState;
}

export function getIntervalForDifficulty(level: number, difficulty: Difficulty): string {
  let simulatedLevel = level;
  switch (difficulty) {
    case 'again': simulatedLevel = 1; break;
    case 'hard': simulatedLevel = level === 0 ? 1 : level; break;
    case 'good': 
      simulatedLevel = Math.min(level + 1, INTERVALS.length - 1);
      if (level === 0) simulatedLevel = 2;
      break;
    case 'easy': 
      simulatedLevel = Math.min(level + 2, INTERVALS.length - 1);
      if (level === 0) simulatedLevel = 3;
      break;
  }
  
  if (difficulty === 'again') return "< 1m";
  const days = INTERVALS[simulatedLevel];
  if (days === 0) return "Soon";
  if (days === 1) return "1d";
  if (days >= 7) return `${Math.floor(days/7)}w`;
  return `${days}d`;
}

export function getDueCards(state: SRSState): SRSCard[] {
  const now = Date.now();
  return (Object.values(state.cards) as SRSCard[])
    .filter((card) => card.nextReview <= now)
    .sort((a, b) => a.nextReview - b.nextReview);
}

export function getStats(state: SRSState) {
  const cardList = Object.values(state.cards) as SRSCard[];
  const total = cardList.length;
  const levels = [0, 0, 0, 0, 0, 0];
  cardList.forEach(c => levels[c.level]++);
  
  const mastered = levels[5];
  const learning = levels[1] + levels[2] + levels[3] + levels[4];
  const unstarted = levels[0];

  return {
    total,
    mastered,
    learning,
    unstarted,
    levels
  };
}
