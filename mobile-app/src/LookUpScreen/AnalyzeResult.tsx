import { Analysis, CardItem, Result, TagItem } from '@vocably/model';
import { usePostHog } from 'posthog-react-native';
import { FC, useRef, useState } from 'react';
import { Animated, PixelRatio, StyleProp, View, ViewStyle } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Separator } from '../CardListItem';
import { fixMarkdown } from '../fixMarkdown';
import { Deck } from '../languageDeck/useLanguageDeck';
import { Displayer } from '../study/Displayer';
import { mainPadding } from '../styles';
import { AnalyzeResultItem } from './AnalyzeResultItem';
import { associateCards, AssociatedCard } from './associateCards';
import { makeCards } from './makeCards';

type Props = {
  analysis: Analysis;
  cards: CardItem[];
  onAdd: (card: AssociatedCard) => Promise<Result<CardItem>>;
  onRemove: (card: AssociatedCard) => Promise<Result<true>>;
  onTagsChange: (id: string, tags: TagItem[]) => Promise<Result<true>>;
  style?: StyleProp<ViewStyle>;
  deck: Deck;
  leftInset?: number;
  rightInset?: number;
  cardsLimit: number | 'unlimited';
};

export const AnalyzeResult: FC<Props> = ({
  analysis,
  cardsLimit,
  cards,
  onAdd,
  onRemove,
  onTagsChange,
  deck,
  leftInset = 0,
  rightInset = 0,
}) => {
  const associatedCards = associateCards(makeCards(analysis), cards);
  const theme = useTheme();
  const [explanationIsVisible, setExplanationIsVisible] = useState(false);
  const explanationMaxHeight = useRef(new Animated.Value(0)).current;
  const fontScale = PixelRatio.getFontScale();
  const posthog = usePostHog();

  const markdownStyles = {
    body: { color: theme.colors.onSurface, fontSize: 16 },
    hr: {
      backgroundColor: theme.colors.onSurface,
    },
  };

  const toggleExplanation = () => {
    Animated.timing(explanationMaxHeight, {
      toValue: explanationIsVisible ? 0 : 2000 * fontScale, // target height
      duration: explanationIsVisible ? 100 : 200,
      useNativeDriver: false,
    }).start();
    setExplanationIsVisible(!explanationIsVisible);
    posthog.capture(
      explanationIsVisible ? 'hideExplanation' : 'showExplanation'
    );
  };

  return (
    <Displayer scaleAnimationEnabled={false}>
      {analysis.explanation && (
        <>
          <TouchableRipple
            style={{
              width: '100%',
              paddingTop: 16,
              paddingBottom: 16,
              paddingLeft: leftInset + mainPadding,
              paddingRight: rightInset + mainPadding,
              alignItems: 'flex-end',
            }}
            onPress={toggleExplanation}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Text style={{ color: theme.colors.primary, fontSize: 16 }}>
                Explanation
              </Text>
              <Icon
                name={explanationIsVisible ? 'chevron-down' : 'chevron-right'}
                color={theme.colors.primary}
                size={18}
              />
            </View>
          </TouchableRipple>
          <Animated.View
            style={{
              paddingLeft: leftInset + mainPadding,
              paddingRight: rightInset + mainPadding,
              maxHeight: explanationMaxHeight,
              overflow: 'hidden',
            }}
          >
            <View style={{ paddingBottom: 12 }}>
              <Markdown style={markdownStyles}>
                {fixMarkdown(analysis.explanation)}
              </Markdown>
            </View>
          </Animated.View>
          <Separator />
        </>
      )}
      {associatedCards.map((item, index) => (
        <View key={`${item.card.source}${item.card.partOfSpeech}`}>
          {index > 0 && <Separator />}
          <AnalyzeResultItem
            leftInset={leftInset}
            rightInset={rightInset}
            onAdd={onAdd}
            onRemove={onRemove}
            onTagsChange={onTagsChange}
            item={item}
            deck={deck}
            cardsLimit={cardsLimit}
          />
        </View>
      ))}
    </Displayer>
  );
};
