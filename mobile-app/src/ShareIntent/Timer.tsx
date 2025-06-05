import { FC, PropsWithChildren, useRef } from 'react';
import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { exitSharedScreen } from '../exitSharedScreen';
import { plural } from '../plural';
import { useMinutesBeforeNextTranslation } from '../useMinutesBeforeNextTranslation';

type Props = {};

export const Timer: FC<PropsWithChildren<Props>> = ({ children }) => {
  const minutesLeft = useMinutesBeforeNextTranslation();
  const insets = useSafeAreaInsets();
  const initialMinutesRef = useRef(minutesLeft);
  const hadShownRef = useRef(false);

  if (
    minutesLeft === 0 ||
    initialMinutesRef.current === 0 ||
    hadShownRef.current
  ) {
    hadShownRef.current = true;
    return <>{children}</>;
  }

  return (
    <View
      style={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        gap: 8,
        position: 'relative',
      }}
    >
      <View
        style={{
          paddingLeft: insets.left + 8,
          paddingRight: insets.right + 8,
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
        }}
      >
        <IconButton
          icon={'close'}
          onPress={exitSharedScreen}
          style={{ alignSelf: 'flex-end' }}
        />
      </View>
      <Text style={{ fontSize: 90, textAlign: 'center' }}>{minutesLeft}</Text>
      <Text style={{ textAlign: 'center' }}>
        {plural(minutesLeft, 'minute', false)} before the next translation.
      </Text>
      <Text style={{ textAlign: 'center' }}>
        Go Premium for unlimited translations.
      </Text>
      <Text style={{ textAlign: 'center' }}>
        Open the app and go to Settings for more details.
      </Text>
    </View>
  );
};
