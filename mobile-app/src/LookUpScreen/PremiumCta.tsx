import { FC, useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { plural } from '../plural';

type Props = {
  minutes: number;
  padding?: number;
};

export const PremiumCta: FC<Props> = ({ minutes, padding = 16 }) => {
  async function presentPaywall(): Promise<boolean> {
    // Present paywall for current offering:
    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall();

    switch (paywallResult) {
      case PAYWALL_RESULT.NOT_PRESENTED:
      case PAYWALL_RESULT.ERROR:
      case PAYWALL_RESULT.CANCELLED:
        return false;
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        return true;
      default:
        return false;
    }
  }

  const maxHeight = useRef(new Animated.Value(minutes === 0 ? 0 : 200)).current;

  useEffect(() => {
    Animated.timing(maxHeight, {
      toValue: minutes === 0 ? 0 : 200,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [minutes]);

  const theme = useTheme();
  return (
    <Animated.View
      style={{
        overflow: 'hidden',
        maxHeight: maxHeight,
      }}
    >
      <View
        style={{
          paddingHorizontal: padding,
          paddingTop: padding,
        }}
      >
        <View
          style={{
            padding: 12,
            borderRadius: 12,
            backgroundColor: theme.colors.inversePrimary,
            gap: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: theme.colors.secondary }}>
            Next translation available in {plural(minutes, 'minute')}.
          </Text>
          <Button
            mode="contained"
            style={{ alignSelf: 'stretch' }}
            onPress={() => presentPaywall()}
          >
            Upgrade to Premium
          </Button>
        </View>
      </View>
    </Animated.View>
  );
};
