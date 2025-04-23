import { isError, Result } from '@vocably/model';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Sentry } from './BetterSentry';

type AsyncSuccess<T> = {
  status: 'loaded';
  value: T;
};

type AsyncFailure = {
  status: 'failed';
  error: any;
};

type AsyncLoading = {
  status: 'loading';
};

export type AsyncResult<T> = AsyncSuccess<T> | AsyncFailure | AsyncLoading;

export const useAsync = <T>(
  load: () => Promise<T>,
  mutate?: (newValue: T) => Promise<unknown>
): [AsyncResult<T>, (newValue: T) => Promise<Result<unknown>>] => {
  const [result, setResult] = useState<AsyncResult<T>>({
    status: 'loading',
  });

  useEffect(() => {
    load()
      .then((value) => {
        if (isError(value)) {
          setResult({
            status: 'failed',
            error: value,
          });

          Sentry.captureException(
            new Error('Unable to perform async request in the component.'),
            {
              extra: value,
            }
          );

          return;
        }

        setResult({
          status: 'loaded',
          value,
        });
      })
      .catch((error) => {
        Sentry.captureException(error);

        setResult({
          status: 'failed',
          error,
        });
      });
  }, []);

  const update = useCallback(
    async (newValue: T): Promise<Result<unknown>> => {
      const lastResult = result;

      setResult({
        status: 'loaded',
        value: newValue,
      });

      if (!mutate) {
        return {
          success: true,
          value: null,
        };
      }

      try {
        const result = await mutate(newValue);
        if (isError(result)) {
          return result;
        }

        return {
          success: true,
          value: null,
        };
      } catch (error) {
        Alert.alert('Error', 'Unable to perform the operation.');
        console.error('Mutation failed', error);
        setResult(lastResult);

        if (isError(error)) {
          return error;
        }

        return {
          success: false,
          errorCode: 'FUCKING_ERROR',
          reason: 'Unable to save the mutation',
          extra: error,
        };
      }
    },
    [mutate, result, setResult]
  );

  return [result, update];
};
