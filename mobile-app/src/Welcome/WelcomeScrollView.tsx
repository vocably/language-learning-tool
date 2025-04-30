import { FC, PropsWithChildren } from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
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
      contentContainerStyle={{
        paddingLeft: insets.left + mainPadding,
        paddingRight: insets.right + mainPadding,
        paddingBottom: mainPadding,
        paddingTop: mainPadding,
        flexGrow: 1,
        alignItems: 'center',
      }}
    >
      <View
        style={[
          {
            maxWidth: 400,
            width: '100%',
          },
          style,
        ]}
      >
        {children}
      </View>
    </ScrollView>
  );
};
