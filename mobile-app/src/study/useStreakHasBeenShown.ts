import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncResult, useAsync } from '../useAsync';

const getToday = (): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today.getTime();
};

const retrieveLastPracticeDayTs = (): Promise<number> => {
  return AsyncStorage.getItem('lastPracticeDay').then((lastPracticeDay) => {
    return Number(lastPracticeDay ?? 0);
  });
};

const storeLastPracticeDayTs = (dayTs: number) => {
  return AsyncStorage.setItem('lastPracticeDay', dayTs.toString());
};

export const useStreakHasBeenShown = (): [
  AsyncResult<boolean>,
  () => Promise<any>
] => {
  const today = getToday();

  const [lastPracticeDayResult, setLastPracticeDay] = useAsync(
    retrieveLastPracticeDayTs,
    storeLastPracticeDayTs
  );

  const setIsShown = () => {
    return setLastPracticeDay(today);
  };

  if (lastPracticeDayResult.status !== 'loaded') {
    return [lastPracticeDayResult, setIsShown];
  }

  return [
    {
      status: 'loaded',
      value: lastPracticeDayResult.value === today,
    },
    setIsShown,
  ];
};
