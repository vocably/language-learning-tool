import { CardItem } from '@vocably/model';
import { SrsScore } from '@vocably/srs';
import React, { FC } from 'react';
import { Card } from './Card';
import { craftTheStrategy } from './craftTheStrategy';
import { MultiChoice } from './MultiChoice';
import { SwipeGrade } from './SwipeGrade';

type Props = {
  autoPlay: boolean;
  isMultiChoiceEnabled: boolean;
  preferMultiChoiceEnabled: boolean;
  card: CardItem;
  onGrade: (score: SrsScore) => void;
  existingCards: CardItem[];
  prerenderedCards: CardItem[];
};

export const Grade: FC<Props> = ({
  card,
  isMultiChoiceEnabled,
  preferMultiChoiceEnabled,
  existingCards,
  autoPlay,
  onGrade,
  prerenderedCards,
}) => {
  const { immediateStep } = craftTheStrategy({
    isMultiChoiceEnabled,
    preferMultiChoiceEnabled,
    card,
    allCards: existingCards,
    prerenderedCards,
  });

  const strategyStep = () => {
    switch (immediateStep.step) {
      case 'sb':
        return (
          <SwipeGrade onGrade={onGrade} key={card.id}>
            <Card autoPlay={autoPlay} card={card} direction="back" />
          </SwipeGrade>
        );
      case 'mf':
        return (
          <MultiChoice
            key={card.id}
            autoPlay={autoPlay}
            card={card}
            alternatives={immediateStep.multiChoice}
            onGrade={onGrade}
            direction="front"
          />
        );
      case 'mb':
        return (
          <MultiChoice
            key={card.id}
            autoPlay={autoPlay}
            card={card}
            alternatives={immediateStep.multiChoice}
            onGrade={onGrade}
            direction="back"
          />
        );
      default:
        return (
          <SwipeGrade onGrade={onGrade} key={card.id}>
            <Card autoPlay={autoPlay} card={card} direction="front" />
          </SwipeGrade>
        );
    }
  };

  return <>{strategyStep()}</>;
};
