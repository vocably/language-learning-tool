import { INITIAL_E_FACTOR, INITIAL_INTERVAL, INITIAL_REPETITION } from './item';
import { SliceItem } from './types';

export const isNew = (item: SliceItem): boolean => {
  return (
    item.data.interval === INITIAL_INTERVAL &&
    item.data.repetition === INITIAL_REPETITION &&
    item.data.eFactor === INITIAL_E_FACTOR
  );
};
