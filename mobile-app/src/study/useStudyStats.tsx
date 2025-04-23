import { fetchStudyStreak, putStudyStreak } from '@vocably/api';
import { Result, StudyStreak } from '@vocably/model';
import { setStreak } from '@vocably/model-operations';
import { dateToString } from '@vocably/sulna';
import { getTimeZone } from 'react-native-localize';
import { AsyncResult, useAsync } from '../useAsync';

type ReturnValues = {
  streak: StudyStreak;
  setStreak: () => Promise<Result<unknown>>;
};

export const useStudyStats = (): AsyncResult<ReturnValues> => {
  const today = dateToString(new Date());
  const [studyStreakResult, saveStudyStreak] = useAsync(
    (): Promise<StudyStreak> =>
      fetchStudyStreak().then((r) => {
        if (r.success === true) {
          return r.value;
        }

        console.error('Unable to fetch study streak', r);

        throw r;
      }),
    putStudyStreak
  );

  if (studyStreakResult.status !== 'loaded') {
    return studyStreakResult;
  }

  return {
    status: 'loaded',
    value: {
      streak: studyStreakResult.value,
      setStreak: () => {
        const newStreak = setStreak(
          studyStreakResult.value,
          today,
          getTimeZone()
        );

        return saveStudyStreak(newStreak);
      },
    },
  };
};
