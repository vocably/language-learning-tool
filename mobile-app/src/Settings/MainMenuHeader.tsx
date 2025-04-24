import { StackHeaderProps } from '@react-navigation/stack';
import { FC } from 'react';
import { Appbar } from 'react-native-paper';

export const MainMenuHeader: FC<StackHeaderProps> = ({
  back,
  options,
  navigation,
}) => {
  return (
    <Appbar.Header elevated={true}>
      {back && (
        <Appbar.BackAction
          onPress={navigation.goBack}
          style={{ backgroundColor: 'transparent' }}
        />
      )}
      <Appbar.Content
        style={{
          alignItems: 'flex-start',
        }}
        title={options.title}
      />
    </Appbar.Header>
  );
};
