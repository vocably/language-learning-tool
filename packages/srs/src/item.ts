import { SrsItem } from '@vocably/model';
import { buildDueDate } from './dueDate';

export const INITIAL_INTERVAL = 0;
export const INITIAL_REPETITION = 0;
export const INITIAL_E_FACTOR = 2.5;

export const createSrsItem = (): SrsItem => ({
  interval: INITIAL_INTERVAL,
  repetition: INITIAL_REPETITION,
  eFactor: INITIAL_E_FACTOR,
  dueDate: buildDueDate(0),
});
