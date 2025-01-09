import { Card, GoogleLanguage } from '@vocably/model';

export type OnboardingData = {
  welcomeScreenCard: Card;
  directTranslationExample: {
    sourceLanguage: GoogleLanguage;
    targetLanguage: GoogleLanguage;
    isReversed: boolean;
    text: string;
    results: [Card, ...Card[]];
  };
  reverseTranslationExample: {
    sourceLanguage: GoogleLanguage;
    targetLanguage: GoogleLanguage;
    isReversed: boolean;
    text: string;
    results: [Card, ...Card[]];
  };
  contextTranslationExample: {
    text: string;
    results: [Card, ...Card[]];
  };
};
