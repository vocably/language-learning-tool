import { Card, isGoogleTTSLanguage, TagItem } from '@vocably/model';
import React, { FC, useState } from 'react';
import {
  Clipboard,
  PixelRatio,
  Platform,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import {
  ActivityIndicator,
  Chip,
  Divider,
  Portal,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CardDefinition } from './CardDefinition';
import { CardExample } from './CardExample';
import { PlaySound } from './PlaySound';

type Props = {
  card: Card;
  style?: StyleProp<ViewStyle>;
  showExamples?: boolean;
  savingTagsInProgress?: boolean;
  onTagsChange?: (tags: TagItem[]) => Promise<any>;
  allowCopy?: boolean;
};

const textTransform = [{ translateY: Platform.OS === 'android' ? 6 : 3 }];
const lineHeight = 24;

export const CardListItem: FC<Props> = ({
  card,
  style,
  showExamples = false,
  savingTagsInProgress = false,
  onTagsChange = () => null,
  allowCopy = false,
}) => {
  const theme = useTheme();

  const onTagClose = (tagToRemove: TagItem) => () => {
    onTagsChange(card.tags.filter((t) => t.id !== tagToRemove.id));
  };

  const [copied, setCopied] = useState(false);

  const fontScale = PixelRatio.getFontScale();

  return (
    <View style={style}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          width: '100%',
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 16,
              textAlignVertical: 'top',
            }}
          >
            {isGoogleTTSLanguage(card.language) && (
              <>
                <PlaySound
                  text={card.source}
                  language={card.language}
                  size={22}
                  style={{
                    transform: [
                      { translateY: Platform.OS === 'android' ? 4 : 1 },
                    ],
                  }}
                />{' '}
              </>
            )}
            <Text
              style={{
                fontSize: 24,
                color: theme.colors.secondary,
              }}
            >
              {card.source}
            </Text>
            {allowCopy && (
              <>
                {'\u00A0'}
                <Pressable
                  hitSlop={10}
                  onPress={() => {
                    Clipboard.setString(card.source);
                    !copied && setCopied(true);
                  }}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.4 : 1,
                    transform: [
                      { translateY: Platform.OS === 'android' ? 3 : 0 },
                    ],
                  })}
                >
                  <Icon
                    name="content-copy"
                    size={16 * fontScale}
                    color={theme.colors.onSurface}
                  />
                </Pressable>
              </>
            )}
            {card.ipa && (
              <>
                {' '}
                <View style={{ transform: textTransform }}>
                  <Text style={{ lineHeight }}>[{card.ipa}]</Text>
                </View>
              </>
            )}

            {card.g && (
              <>
                {' '}
                <View style={{ transform: textTransform }}>
                  <Text style={{ lineHeight }}>({card.g})</Text>
                </View>
              </>
            )}

            {card.partOfSpeech && (
              <>
                {' '}
                <View style={{ transform: textTransform }}>
                  <Text style={{ lineHeight }}>{card.partOfSpeech}</Text>
                </View>
              </>
            )}
          </Text>
        </View>
      </View>
      {allowCopy && (
        <Portal>
          <Snackbar
            visible={copied}
            onDismiss={() => copied && setCopied(false)}
            duration={2000}
          >
            Copied to clipboard.
          </Snackbar>
        </Portal>
      )}
      <View style={{ marginTop: 8 }}>
        <CardDefinition card={card} />
      </View>
      {showExamples && card.example && (
        <View style={{ marginStart: 10, marginTop: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>Examples</Text>
          <CardExample example={card.example} />
        </View>
      )}
      {(card.tags.length > 0 || savingTagsInProgress) && (
        <View
          style={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            minHeight: 36,
          }}
        >
          {card.tags.map((tag) => (
            <Chip
              key={tag.id}
              selectedColor={theme.colors.onSurface}
              mode="outlined"
              onClose={onTagClose(tag)}
            >
              {tag.data.title}
            </Chip>
          ))}
          {savingTagsInProgress && (
            <ActivityIndicator color={theme.colors.onBackground} />
          )}
        </View>
      )}
    </View>
  );
};

export const Separator: FC = () => <Divider style={{ zIndex: 1 }} />;
