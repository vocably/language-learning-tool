import { Card } from '@vocably/model';
import { FC, useState } from 'react';
import { View } from 'react-native';
import { IconButton, Menu, useTheme } from 'react-native-paper';
import { FormText } from './ui/FormText';

type CardFormCard = Pick<
  Card,
  'source' | 'ipa' | 'partOfSpeech' | 'translation' | 'definition' | 'example'
>;

type Props = {
  card: CardFormCard;
  onChange: (value: CardFormCard) => void;
};

export const CardForm: FC<Props> = ({ card, onChange }) => {
  const onTextChange = (paramName: keyof CardFormCard) => (value: string) => {
    onChange({
      ...card,
      [paramName]: value,
    });
  };
  const theme = useTheme();

  const [partOfSpeechMenuVisible, setPartOfSpeechMenuVisible] = useState(false);

  return (
    <View style={{ gap: 8 }}>
      <FormText
        label="Word or phrase"
        value={card.source}
        onChangeText={onTextChange('source')}
      />
      <FormText
        label="Translation"
        value={card.translation}
        onChangeText={onTextChange('translation')}
      />
      <FormText
        label={'Part of Speech'}
        value={card.partOfSpeech}
        onChangeText={onTextChange('partOfSpeech')}
        right={
          <Menu
            visible={partOfSpeechMenuVisible}
            onDismiss={() => setPartOfSpeechMenuVisible(false)}
            anchor={
              <IconButton
                icon={'menu-down'}
                onPress={() => setPartOfSpeechMenuVisible(true)}
                style={{
                  backgroundColor: 'transparent',
                  padding: 0,
                }}
              />
            }
          >
            {['noun', 'verb', 'adjective', 'adverb', 'phrase'].map((pos) => (
              <Menu.Item
                key={pos}
                onPress={() => {
                  onTextChange('partOfSpeech')(pos);
                  setPartOfSpeechMenuVisible(false);
                }}
                title={pos}
              />
            ))}
          </Menu>
        }
      />
      <FormText
        label={'Transcription (IPA)'}
        value={card.ipa}
        onChangeText={onTextChange('ipa')}
      />
      <FormText
        label={'Definition'}
        value={card.definition}
        multiline={true}
        onChangeText={onTextChange('definition')}
      />
      <FormText
        label={'Example'}
        value={card.example}
        multiline={true}
        onChangeText={onTextChange('example')}
      />
    </View>
  );
};
