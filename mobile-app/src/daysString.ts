import { calculateDays } from '@vocably/sulna';

export const daysString = (todayTs: number, dueDate: number): string => {
  const days = calculateDays(todayTs, dueDate);

  if (days === 1) {
    return `1 day`;
  } else {
    return `${days} days`;
  }
};
