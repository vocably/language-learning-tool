import { isObject } from 'lodash-es';

export type Tag = {
  title: string;
};

export type TagItem = {
  id: string;
  created: number;
  updated?: number;
  data: Tag;
};

export const isTagItem = (item: any): item is TagItem => {
  if (!isObject(item)) {
    return false;
  }

  return item['id'] && isObject(item['data']) && item['data']['title'];
};

export type NewTag = {
  data: Tag;
};

export type StrategyStep = {
  step: 'sf' | 'sb' | 'mf' | 'mb';
  allowedFailures: number | null;
};

export type StudyStrategy = [StrategyStep, ...StrategyStep[]];

/**
 * "s" is the "step" of a strategy
 * sf == swipe front
 * sb == swipe back
 * mf == multi-choice front
 * mb == multi-choice back
 *
 * "f" number of failed attempts in a row
 */
export type SrsItemState = {
  s: StrategyStep['step'];
  f: number;
};

export type SrsItem = {
  interval: number;
  repetition: number;
  eFactor: number;
  dueDate: number;
  lastStudied?: number;
  state?: SrsItemState;
};

export type Card = {
  language: string;
  source: string;
  ipa?: string;
  g?: string;
  example?: string;
  definition: string;
  translation: string;
  partOfSpeech: string;
  tags: TagItem[];
};

export type SrsCard = Card & SrsItem;

export type CardItem = {
  id: string;
  created: number;
  updated?: number;
  data: SrsCard;
};

export type LanguageDeck = {
  language: string;
  cards: CardItem[];
  tags: TagItem[];
};

export const byDate = (a: CardItem, b: CardItem): number => {
  let k = b.created - a.created;

  if (k !== 0) {
    return k;
  }

  k = a.data.source.localeCompare(b.data.source);

  if (k !== 0) {
    return k;
  }

  return a.data.partOfSpeech.localeCompare(b.data.partOfSpeech);
};

export const isSrsCard = (card: Card & Partial<SrsItem>): card is SrsCard => {
  return (
    'interval' in card &&
    'repetition' in card &&
    'eFactor' in card &&
    'dueDate' in card
  );
};
