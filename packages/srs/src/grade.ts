import { SrsItem, StudyStrategy } from '@vocably/model';
import { last } from 'lodash-es';
import { buildDueDate } from './dueDate';
import { pickNextItemState } from './pickNextItemState';

export type SrsScore = 0 | 1 | 2 | 3 | 4 | 5;

const isLastStrategyResponse = (
  item: SrsItem,
  studyStrategy: StudyStrategy
) => {
  if (!item.state) {
    return false;
  }

  const lastStep = last(studyStrategy);
  if (!lastStep) {
    return false;
  }

  return lastStep.step === item.state.s;
};

export const grade = (
  item: SrsItem,
  score: SrsScore,
  studyStrategy: StudyStrategy
): SrsItem => {
  let nextInterval: number;
  let nextRepetition: number;
  let nextEFactor: number;
  let dueDate: number;

  if (score === 5) {
    if (item.repetition < studyStrategy.length - 1) {
      nextInterval = 1;
      nextRepetition = item.repetition + 1;
      dueDate = buildDueDate(1);
    } else if (item.repetition === studyStrategy.length - 1) {
      nextInterval = 6;
      dueDate = buildDueDate(6);
      nextRepetition = item.repetition + 1;
    } else if (
      item.repetition + 1 >= studyStrategy.length * 2 ||
      isLastStrategyResponse(item, studyStrategy) ||
      (item.repetition + 1) % studyStrategy.length === 0
    ) {
      nextInterval = Math.round(item.interval * item.eFactor);
      nextRepetition = item.repetition + 1;
      dueDate = buildDueDate(nextInterval);
    } else {
      nextInterval = item.interval;
      nextRepetition = item.repetition + 1;
      dueDate = buildDueDate(1);
    }

    nextEFactor =
      item.eFactor +
      (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02)) / studyStrategy.length;
  } else if (score >= 3) {
    nextInterval = item.interval;
    nextRepetition = item.repetition;
    dueDate = buildDueDate(1);

    nextEFactor =
      item.eFactor + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02));
  } else {
    nextInterval = 1;
    nextRepetition = 0;
    dueDate = buildDueDate(1);
    nextEFactor =
      item.eFactor + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02));
  }

  if (nextEFactor < 1.3) nextEFactor = 1.3;

  const nextState = pickNextItemState(item, score, studyStrategy);

  return {
    interval: nextInterval,
    repetition: nextRepetition,
    eFactor: Math.round(nextEFactor * 100) / 100,
    dueDate: dueDate,
    state: nextState,
    lastStudied: new Date().getTime(),
  };
};
