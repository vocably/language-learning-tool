import { FC, PropsWithChildren } from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';
import { IPhone } from './Telephone/iPhone';
import { Pixel } from './Telephone/Pixel';
import { ColorScheme } from './useColorScheme';

type Props = {
  style?: StyleProp<ViewStyle>;
  colorScheme?: ColorScheme;
};

export const Telephone: FC<PropsWithChildren<Props>> = (props) => {
  if (Platform.OS === 'android') {
    return <Pixel {...props}></Pixel>;
  } else {
    return <IPhone {...props}></IPhone>;
  }
};
