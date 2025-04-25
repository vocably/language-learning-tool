import { FC, PropsWithChildren } from 'react';
import { ScrollView, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mainPadding } from '../styles';

type Props = PropsWithChildren<{
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

export const CustomScrollView: FC<Props> = ({
  contentContainerStyle,
  children,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerStyle={[
        {
          paddingTop: mainPadding,
          paddingBottom: insets.bottom + mainPadding,
          paddingLeft: insets.left + mainPadding,
          paddingRight: insets.right + mainPadding,
        },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
};
