import { CardItem } from '@vocably/model';
import { studyPlan } from './studyPlan';

export const slice = (
  today: Date,
  maxCards: number,
  list: CardItem[]
): CardItem[] => {
  if (list.length === 0) {
    return [];
  }

  const plan = studyPlan(today, list);
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

  result.push(...plan.future.slice(0, maxCards - result.length));

  return result;
};
