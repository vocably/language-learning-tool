import { StackHeaderProps } from '@react-navigation/stack';
import React, { FC } from 'react';
import { Appbar } from 'react-native-paper';

type Header = FC<StackHeaderProps>;

export const Header: Header = ({ options, back, navigation, route }) => {
  return (
    <Appbar.Header elevated={true}>
      {back && (
        <Appbar.BackAction
          onPress={navigation.goBack}
          style={{ backgroundColor: 'transparent' }}
        />
      )}

      <Appbar.Content
        style={{ alignItems: 'flex-start' }}
        title={options.title}
      />
    </Appbar.Header>
  );
};
