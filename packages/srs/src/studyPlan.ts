import { byDate, CardItem } from '@vocably/model';
import { isNew } from './isNew';

type StudyPlan = {
  today: CardItem[];
  expired: CardItem[];
  notStarted: CardItem[];
  tomorrow: CardItem[];
  future: CardItem[];
};

export const studyPlan = (today: Date, list: CardItem[]) => {
  const todayTS = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );

  const tomorrowTs = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate() + 1
  );

  const result: StudyPlan = {
    today: [],
    expired: [],
    notStarted: [],
    tomorrow: [],
    future: [],
  };

  list.forEach((item) => {
    if (item.data.dueDate === todayTS) {
      result.today.push(item);
    } else if (item.data.dueDate > todayTS) {
      if (item.data.dueDate === tomorrowTs) {
        result.tomorrow.push(item);
      } else {
        result.future.push(item);
      }
    } else if (item.data.dueDate < todayTS && isNew(item)) {
      result.notStarted.push(item);
    } else {
      result.expired.push(item);
    }
  });

  result.today.sort(byDate);
  result.expired.sort((a, b) => b.data.dueDate - a.data.dueDate);
  result.notStarted.sort((a, b) => a.created - b.created);
  result.future.sort((a, b) => a.data.dueDate - b.data.dueDate);

  return result;
};
