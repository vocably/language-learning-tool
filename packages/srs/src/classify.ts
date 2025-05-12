import { SliceItem } from './types';

type ClassifiedItems<T> = {
  past: T[];
  future: T[];
  today: T[];
};

export const classify = <T extends SliceItem>(
  todayTs: number,
  list: T[]
): ClassifiedItems<T> => {
  const classifiedListItems: ClassifiedItems<T> = {
    past: [],
    future: [],
    today: [],
  };

  list.forEach((item) => {
    if (item.data.dueDate < todayTs) {
      classifiedListItems.past.push(item);
    } else if (item.data.dueDate === todayTs) {
      classifiedListItems.today.push(item);
    } else {
      classifiedListItems.future.push(item);
    }
  });

  return classifiedListItems;
};
