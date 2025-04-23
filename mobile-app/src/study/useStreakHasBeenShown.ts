import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncResult, useAsync } from '../useAsync';

const getToday = (): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today.getTime();
};

const retrieveLastStudyDayTs = (): Promise<number> => {
  return AsyncStorage.getItem('lastStudyDay').then((lastStudyDay) => {
    return Number(lastStudyDay ?? 0);
  });
};

const storeLastStudyDayTs = (dayTs: number) => {
  return AsyncStorage.setItem('lastStudyDay', dayTs.toString());
};

export const useStreakHasBeenShown = (): [
  AsyncResult<boolean>,
  () => Promise<any>
] => {
  const today = getToday();

  const [lastStudyDayResult, setLastStudyDay] = useAsync(
    retrieveLastStudyDayTs,
    storeLastStudyDayTs
  );

  const setIsShown = () => {
    return setLastStudyDay(today);
  };

  if (lastStudyDayResult.status !== 'loaded') {
    return [lastStudyDayResult, setIsShown];
  }

  return [
    {
      status: 'loaded',
      value: lastStudyDayResult.value === today,
    },
    setIsShown,
  ];
};
