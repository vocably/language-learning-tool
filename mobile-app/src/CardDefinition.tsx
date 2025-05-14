import { Card } from '@vocably/model';
import { explode } from '@vocably/sulna';
import React, { FC } from 'react';
import { StyleProp } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { maskTheWord } from './maskTheWord';

type Props = {
  card: Card;
  textStyle?: StyleProp<Text>;
  maskSource?: boolean;
};

export const CardDefinition: FC<Props> = ({
  card,
  textStyle,
  maskSource = false,
}) => {
  const theme = useTheme();
  let definitions = explode(card.definition).map((text) => ({
    text,
    style: {},
  }));

  if (maskSource) {
    definitions = definitions
      .filter(
        (definition) =>
          !(definition.text.includes('[') && definition.text.includes(']'))
      )
      .map((definition) => {
        return {
          ...definition,
          text: maskTheWord(card.source, card.language)(definition.text).value,
        };
      });
  }

  if (card.translation) {
    definitions.unshift({
      text: card.translation,
      style: {
        color: theme.colors.secondary,
      },
    });
  }

  return (
    <>
      {definitions.map((item, index) => (
        <Text
          key={index}
          style={[item.style, textStyle]}
        >{`\u2022 ${item.text}`}</Text>
      ))}
    </>
  );
};
