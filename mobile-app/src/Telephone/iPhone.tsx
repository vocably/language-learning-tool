import { FC, PropsWithChildren, useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { ColorScheme } from '../useColorScheme';

type Props = {
  style?: StyleProp<ViewStyle>;
  colorScheme?: ColorScheme;
};

export const IPhone: FC<PropsWithChildren<Props>> = ({
  style = {},
  colorScheme = 'light',
  children,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  return (
    <View
      style={[
        {
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        },
        style,
      ]}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
    >
      <ImageBackground
        source={require('./iPhone.png')}
        resizeMode="cover"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          height: (containerWidth / 900) * 1828,
        }}
      >
        <View
          style={{
            transform: [
              {
                scale: 0.86,
              },
            ],
          }}
        >
          {children}
        </View>
        <View
          style={{
            position: 'absolute',
            left: containerWidth / 22.14,
            top: 18,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            resizeMode="cover"
            source={
              colorScheme === 'light'
                ? require('./iPhoneHeaderLight.png')
                : require('./iPhoneHeaderDark.png')
            }
            style={{
              width: containerWidth / 1.25,
              height: containerWidth / 12,
            }}
          />
        </View>
      </ImageBackground>
    </View>
  );
};
