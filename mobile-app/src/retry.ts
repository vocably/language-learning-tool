import { isError } from '@vocably/model';

export const retry = async <T>(
  func: () => Promise<T>,
  attempts = 3,
  delay = 100
): Promise<T> => {
  let lastException;
  let lastError: T | undefined;

  for (let i = 1; i <= attempts; i++) {
    try {
      const result = await func();
      if (!isError(result)) {
        return result;
      } else {
        lastException = undefined;
        lastError = result;
      }
    } catch (e) {
      lastError = undefined;
      lastException = e;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  if (lastError) {
    return lastError;
  }

  throw lastException;
};
