import { FC, PropsWithChildren } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { MD3Elevation, Surface } from 'react-native-paper';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  elevation?: MD3Elevation;
}>;

export const CustomSurface: FC<Props> = ({ style, children, elevation }) => {
  return (
    <Surface
      style={[
        {
          padding: 8,
          borderRadius: 16,
        },
        style,
      ]}
      elevation={elevation}
    >
      {children}
    </Surface>
  );
};
