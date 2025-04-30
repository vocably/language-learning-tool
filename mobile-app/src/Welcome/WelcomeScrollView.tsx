import { FC, PropsWithChildren } from 'react';
import { ScrollView, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mainPadding } from '../styles';

type Props = {
  style?: StyleProp<ViewStyle>;
};

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
          paddingBottom: 100,
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
