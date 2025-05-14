import { CardItem, StudyStrategy } from '@vocably/model';
import { spreadStrategy } from '@vocably/srs/dist/esm/spreadStrategy';
import { getMultiChoice } from './getMultiChoice';

type SwipeFront = {
  step: 'sf';
};

type SwipeBack = {
  step: 'sb';
};

type MultiChoiceFront = {
  step: 'mf';
  multiChoice: [CardItem, CardItem, ...CardItem[]];
};

type MultiChoiceBack = {
  step: 'mb';
  multiChoice: [CardItem, CardItem, ...CardItem[]];
};

type ImmediateStep =
  | SwipeFront
  | SwipeBack
  | MultiChoiceFront
  | MultiChoiceBack;

type Options = {
  isMultiChoiceEnabled: boolean;
  preferMultiChoiceEnabled: boolean;
  card: CardItem;
  allCards: CardItem[];
  prerenderedCards: CardItem[];
};

type ReturnType = {
  strategy: StudyStrategy;
  immediateStep: ImmediateStep;
};

export const craftTheStrategy = ({
  isMultiChoiceEnabled,
  preferMultiChoiceEnabled,
  card,
  allCards,
  prerenderedCards,
}: Options): ReturnType => {
  const swipeStrategy: StudyStrategy = [
    { step: 'sf', allowedFailures: null },
    { step: 'sb', allowedFailures: 0 },
  ];

  if (
    !isMultiChoiceEnabled ||
    (!card.data.translation && !card.data.definition)
  ) {
    const { currentState } = spreadStrategy(card.data.state, swipeStrategy);
    return {
      strategy: swipeStrategy,
      immediateStep: {
        step:
          currentState.s === 'sf' || currentState.s === 'sb'
            ? currentState.s
            : 'sf',
      },
    };
  }

  const multiChoiceItems =
    getMultiChoice(card, allCards) ?? getMultiChoice(card, prerenderedCards);

  if (multiChoiceItems === null) {
    const { currentState } = spreadStrategy(card.data.state, swipeStrategy);
    return {
      strategy: swipeStrategy,
      immediateStep: {
        step:
          currentState.s === 'sf' || currentState.s === 'sb'
            ? currentState.s
            : 'sf',
      },
    };
  }

  if (preferMultiChoiceEnabled) {
    const strategy: StudyStrategy = [
      { step: 'mf', allowedFailures: null },
      { step: 'mb', allowedFailures: null },
    ];

    const { currentState } = spreadStrategy(card.data.state, strategy);
    return {
      strategy,
      immediateStep: {
        step:
          currentState.s === 'mf' || currentState.s === 'mb'
            ? currentState.s
            : 'mf',
        multiChoice: multiChoiceItems,
      },
    };
  }

  const strategy: StudyStrategy = [
    { step: 'mf', allowedFailures: null },
    { step: 'sf', allowedFailures: 0 },
    { step: 'mb', allowedFailures: null },
    { step: 'sb', allowedFailures: 0 },
  ];
  const { currentState } = spreadStrategy(card.data.state, strategy);
  return {
    strategy,
    immediateStep: {
      step: currentState.s,
      multiChoice: multiChoiceItems as [CardItem, CardItem, ...CardItem[]],
    },
  };
};
