import { CardItem } from '@vocably/model';
import { studyPlan } from './studyPlan';

const hasStudied =
  (now: number) =>
  (item: CardItem): boolean => {
    if (!item.data.lastStudied) {
      return true;
    }

    return now - item.data.lastStudied > 1_800_000; // 1_800_000 is 30 minutes in milliseconds
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
    return plan[planSection].filter(hasStudied(now)).slice(0, maxCards);
  }

  const result = plan.today;

  if (result.length >= maxCards) {
    return result;
  }

  result.push(...plan.expired.slice(0, maxCards - result.length));

  if (result.length >= maxCards) {
    return result;
  }

  result.push(...plan.notStarted.slice(0, maxCards - result.length));

  if (result.length >= maxCards) {
    return result;
  }

  result.push(
    ...plan.future.filter(hasStudied(now)).slice(0, maxCards - result.length)
  );

  return result;
};
