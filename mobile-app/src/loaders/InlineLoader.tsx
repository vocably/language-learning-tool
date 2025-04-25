import { FC, PropsWithChildren } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

type Props = PropsWithChildren<{
  center?: boolean;
}>;

export const InlineLoader: FC<Props> = ({ children, center = true }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: center ? 'center' : 'flex-start',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator
        color={theme.colors.secondary}
        style={{ marginRight: 8 }}
        size={'small'}
      ></ActivityIndicator>
      <Text variant="bodyLarge">{children}</Text>
    </View>
  );
};
