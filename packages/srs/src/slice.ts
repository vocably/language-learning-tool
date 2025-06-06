import { CardItem } from '@vocably/model';
import { shuffle } from 'lodash-es';
import { studyPlan } from './studyPlan';

export const STUDY_DELAY_MS = 1_800_000; // 1_800_000 is 30 minutes in milliseconds

export const hasStudied =
  (now: number) =>
  (item: CardItem): boolean => {
    if (!item.data.lastStudied) {
      return true;
    }

    return now - item.data.lastStudied > STUDY_DELAY_MS;
  };

export const slice = (
  today: Date,
  maxCards: number,
  list: CardItem[],
  planSection?: string
): CardItem[] => {
  if (list.length === 0) {
    return [];
  }

  const plan = studyPlan(today, list);

  const now = new Date().getTime();

  if (planSection && plan[planSection]) {
    const candidates = shuffle(plan[planSection].filter(hasStudied(now)));
    if (candidates.length > 0) {
      if (planSection === 'tomorrow') {
        return candidates;
      }
      return candidates.slice(0, maxCards);
    }

    return shuffle(plan[planSection]).slice(0, maxCards);
  }

  const result = plan.today;

  if (result.length >= maxCards) {
    return shuffle(result);
  }

  result.push(...plan.expired.slice(0, maxCards - result.length));

  if (result.length >= maxCards) {
    return shuffle(result);
  }

  result.push(...plan.notStarted.slice(0, maxCards - result.length));

  if (result.length > 0) {
    return shuffle(result);
  }

  const tomorrowCandidates = shuffle(plan.tomorrow.filter(hasStudied(now)));

  if (tomorrowCandidates.length > 0) {
    return tomorrowCandidates.slice(0, maxCards);
  }

  const futureCards = shuffle(plan.tomorrow).concat(plan.future);

  let futureCandidates = futureCards.filter(hasStudied(now));
  if (result.length === 0 && futureCandidates.length === 0) {
    futureCandidates = futureCards;
  }

  result.push(...futureCandidates.slice(0, maxCards - result.length));

  return result;
};
