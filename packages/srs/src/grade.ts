import { SrsItem, StudyStrategy } from '@vocably/model';
import { buildDueDate } from './dueDate';
import { pickNextItemState } from './pickNextItemState';

export type SrsScore = 0 | 1 | 2 | 3 | 4 | 5;

export const grade = (
  item: SrsItem,
  score: SrsScore,
  studyStrategy: StudyStrategy
): SrsItem => {
  let nextInterval: number;
  let nextRepetition: number;
  let nextEFactor: number;
  let dueDate: number;

  if (score >= 3) {
    if (item.repetition < studyStrategy.length - 1) {
      nextInterval = 1;
      nextRepetition = item.repetition + 1;
      dueDate = buildDueDate(1);
    } else if (item.repetition === studyStrategy.length - 1) {
      nextInterval = 6;
      dueDate = buildDueDate(6);
      nextRepetition = item.repetition + 1;
    } else if ((item.repetition + 1) % studyStrategy.length === 0) {
      nextInterval = Math.round(item.interval * item.eFactor);
      nextRepetition = item.repetition + 1;
      dueDate = buildDueDate(nextInterval);
    } else {
      nextInterval = item.interval;
      nextRepetition = item.repetition + 1;
      dueDate = buildDueDate(1);
    }
  } else {
    nextInterval = 1;
    nextRepetition = 0;
    dueDate = buildDueDate(1);
  }

  nextEFactor =
    item.eFactor +
    (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02)) / studyStrategy.length;

  if (nextEFactor < 1.3) nextEFactor = 1.3;

  const nextState = pickNextItemState(item, score, studyStrategy);

  return {
    interval: nextInterval,
    repetition: nextRepetition,
    eFactor: Math.round(nextEFactor * 100) / 100,
    dueDate: dueDate,
    state: nextState,
  };
};
