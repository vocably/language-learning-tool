import { FC, PropsWithChildren } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Surface } from 'react-native-paper';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export const CustomSurface: FC<Props> = ({ style, children }) => {
  return (
    <Surface
      style={[
        {
          padding: 8,
          borderRadius: 16,
        },
        style,
      ]}
    >
      {children}
    </Surface>
  );
};
