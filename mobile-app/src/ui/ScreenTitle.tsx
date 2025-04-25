import { FC } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  style?: StyleProp<ViewStyle>;
  icon: string;
  title: string;
};

export const ScreenTitle: FC<Props> = ({ style, icon, title }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 8,
          marginBottom: 32,
        },
        style,
      ]}
    >
      <Icon name={icon} size={24} color={theme.colors.onBackground} />
      {/*
        Padding right 32 is needed for the Text element not to overflow the outer container: a quirk of React Native
       */}
      <View style={{ paddingRight: 32 }}>
        <Text style={{ fontSize: 24, color: theme.colors.onBackground }}>
          {title}
        </Text>
      </View>
    </View>
  );
};
