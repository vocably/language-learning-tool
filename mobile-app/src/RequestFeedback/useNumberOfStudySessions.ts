import * as asyncAppStorage from '../asyncAppStorage';
import { AsyncResult, useAsync } from '../useAsync';

const numberOfRepetitionsKey = 'numberOfRepetitions';

const retrieveNumberOfStudySessions = (): Promise<number> =>
  asyncAppStorage
    .getItem(numberOfRepetitionsKey)
    .then((receivedNumberOfRepetitions) => {
      if (receivedNumberOfRepetitions !== undefined) {
        return parseInt(receivedNumberOfRepetitions, 10);
      } else {
        return 0;
      }
    })
    .catch(() => 0);

const storeNumberOfStudySessions = (numberOfRepetitions: number) =>
  asyncAppStorage.setItem(
    numberOfRepetitionsKey,
    numberOfRepetitions.toString()
  );

export const useNumberOfStudySessions = (): [
  AsyncResult<number>,
  () => Promise<any>
] => {
  const [numberOfStudySessions, mutateNumberOfStudySessions] = useAsync(
    retrieveNumberOfStudySessions,
    storeNumberOfStudySessions
  );

  const increase = async () => {
    if (numberOfStudySessions.status === 'loaded') {
      await mutateNumberOfStudySessions(numberOfStudySessions.value + 1);
    }
  };

  return [numberOfStudySessions, increase];
};
