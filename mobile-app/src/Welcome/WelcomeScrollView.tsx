import { FC, PropsWithChildren } from 'react';
import { ScrollView, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mainPadding } from '../styles';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const NEXT_BUTTON_HEIGHT = 160;

export const WelcomeScrollView: FC<PropsWithChildren<Props>> = ({
  children,
  style,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerStyle={[
        {
          paddingLeft: insets.left + mainPadding,
          paddingRight: insets.right + mainPadding,
          paddingBottom: insets.bottom + NEXT_BUTTON_HEIGHT - 10,
          paddingTop: mainPadding,
          flexGrow: 1,
          alignItems: 'center',
        },
        style,
      ]}
    >
      {children}
    </ScrollView>
  );
};
