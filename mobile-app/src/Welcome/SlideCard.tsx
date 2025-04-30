import { GoogleLanguage, languageList } from '@vocably/model';
import { usePostHog } from 'posthog-react-native';
import { FC } from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLanguageDeck } from '../languageDeck/useLanguageDeck';
import { AnalyzeResultItem } from '../LookUpScreen/AnalyzeResultItem';
import { associateCards } from '../LookUpScreen/associateCards';
import { getOnboardingData } from '../Onboarding/getOnboardingData';
import { useAnalyzeOperations } from '../useAnalyzeOperations';
import { WelcomeScrollView } from './WelcomeScrollView';

type Props = {
  sourceLanguage: GoogleLanguage;
  targetLanguage: GoogleLanguage;
};

export const SlideCard: FC<Props> = ({ sourceLanguage, targetLanguage }) => {
  const onboardingData = getOnboardingData(sourceLanguage, targetLanguage);
  const posthog = usePostHog();
  const theme = useTheme();
  const deck = useLanguageDeck({
    language: sourceLanguage,
    autoReload: true,
  });

  const welcomeScreenAssociatedCards = associateCards(
    [onboardingData.welcomeScreenCard],
    deck.deck.cards
  );

  const { onAdd, onRemove, onTagsChange } = useAnalyzeOperations({
    deck,
  });

  return (
    <WelcomeScrollView style={{ gap: 16 }}>
      <Text style={{ fontSize: 22, textAlign: 'center' }}>
        Vocably translates words and makes flashcards like this one:
      </Text>

      {onboardingData.isFallback && (
        <View>
          <Text style={{ fontWeight: 'bold' }}>
            Note from the author of Vocably
          </Text>
          <Text>
            These card samples are inaccurate and confusing. I apologize for
            that. I'm working on accurate examples for onboarding users who
            study {languageList[sourceLanguage]} and speak{' '}
            {languageList[targetLanguage]}.
          </Text>
        </View>
      )}

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: theme.colors.secondary,
          borderWidth: 1,
          borderRadius: 16,
        }}
      >
        <AnalyzeResultItem
          hideOperations={!!onboardingData.isFallback}
          onAdd={(card) => {
            posthog.capture('onboardingCardAdded', {
              sourceLanguage,
              targetLanguage,
              cardSource: welcomeScreenAssociatedCards[0].card.source,
            });
            return onAdd(card);
          }}
          onRemove={(card) => {
            posthog.capture('onboardingCardRemoved', {
              sourceLanguage,
              targetLanguage,
              cardSource: welcomeScreenAssociatedCards[0].card.source,
            });

            return onRemove(card);
          }}
          onTagsChange={(id, tags) => {
            posthog.capture('onboardingCardTagsChange', {
              sourceLanguage,
              targetLanguage,
              cardSource: welcomeScreenAssociatedCards[0].card.source,
              tags: tags.map((tag) => tag.data.title),
            });

            return onTagsChange(id, tags);
          }}
          item={welcomeScreenAssociatedCards[0]}
          deck={deck}
        />
      </View>
      <Text style={{ fontSize: 22, textAlign: 'center' }}>
        You can save <Icon name="plus-circle-outline" size={18} /> your
        flashcards and study them with spaced repetition system.
      </Text>
    </WelcomeScrollView>
  );
};
