import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

export type DisplayerRef = {
  hide: () => Promise<any>;
};

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleAnimationEnabled?: boolean;
};

export const Displayer = forwardRef<DisplayerRef, Props>(
  ({ children, style, scaleAnimationEnabled = true }, ref) => {
    const scaleAnimation = useRef(
      new Animated.Value(scaleAnimationEnabled ? 0.5 : 1)
    ).current;
    const opacityAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),

        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    useImperativeHandle(ref, () => ({
      hide: () =>
        new Promise((resolve) => {
          Animated.parallel([
            Animated.sequence([
              Animated.timing(scaleAnimation, {
                toValue: 1.1,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnimation, {
                toValue: 0.7,
                duration: 250,
                useNativeDriver: true,
              }),
            ]),

            Animated.timing(opacityAnimation, {
              toValue: 0,
              duration: 350,
              useNativeDriver: true,
            }),
          ]).start(resolve);
        }),
    }));

    return (
      <Animated.View
        style={[
          {
            opacity: opacityAnimation,
            transform: [{ scale: scaleAnimation }],
            width: '100%',
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    );
  }
);
