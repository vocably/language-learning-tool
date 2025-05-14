import { explode } from '@vocably/sulna';
import React, { FC } from 'react';
import { StyleProp } from 'react-native';
import { Text } from 'react-native-paper';
import { maskTheWord } from './maskTheWord';

type Props = {
  example: string;
  textStyle?: StyleProp<Text>;
  mask?: {
    text: string;
    language: string;
  };
};

export const CardExample: FC<Props> = ({ example, textStyle, mask }) => {
  let examples = explode(example);

  if (mask) {
    examples = examples.map(
      (example) => maskTheWord(mask.text, mask.language)(example).value
    );
  }

  if (examples.length === 1) {
    return <Text style={textStyle}>{examples[0]}</Text>;
  }

  return (
    <>
      {examples.map((example, index) => (
        <Text key={index} style={textStyle}>{`\u2022 ${example}`}</Text>
      ))}
    </>
  );
};
