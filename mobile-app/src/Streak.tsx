import { get } from 'lodash-es';
import { FC, useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { getCountry } from 'react-native-localize';
import { Text, useTheme } from 'react-native-paper';
import { getDays, StreakDay } from './streak/getDays';

type Props = {
  consecutiveDays: number;
  hasBeenShown: boolean;
};

const days = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

const dayToString = (day: number): string => {
  return get(days, day, '');
};

const isLastChecked = (index: number, days: StreakDay[]): boolean => {
  const next = days.at(index + 1);
  return days[index].checked && (!next || !next.checked);
};

export const Streak: FC<Props> = ({ consecutiveDays, hasBeenShown }) => {
  const theme = useTheme();

  const days = getDays(consecutiveDays, new Date(), getCountry());
  const dayScale = useRef(new Animated.Value(1)).current;

  const previousNumberOpacity = useRef(
    new Animated.Value(hasBeenShown ? 0 : 1)
  ).current;
  const currentNumberOpacity = useRef(
    new Animated.Value(hasBeenShown ? 1 : 0)
  ).current;
  const previousNumberTranslateY = useRef(
    new Animated.Value(hasBeenShown ? 1 : 0)
  ).current;
  const currentNUmberTranslateY = useRef(
    new Animated.Value(hasBeenShown ? 0 : 100)
  ).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(dayScale, {
        toValue: 1.2,
        useNativeDriver: true,
        friction: 6,
      }),
      Animated.spring(dayScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 1,
      }),
    ]).start();

    const duration = 1000;

    Animated.parallel([
      Animated.timing(previousNumberTranslateY, {
        useNativeDriver: true,
        toValue: -100,
        duration,
      }),
      Animated.timing(currentNUmberTranslateY, {
        useNativeDriver: true,
        toValue: 0,
        duration,
      }),
      Animated.timing(previousNumberOpacity, {
        useNativeDriver: true,
        toValue: 0,
        duration,
      }),
      Animated.timing(currentNumberOpacity, {
        useNativeDriver: true,
        toValue: 1,
        duration,
      }),
    ]).start();
  }, []);

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            position: 'absolute',
            opacity: previousNumberOpacity,
            transform: [{ translateY: previousNumberTranslateY }],
          }}
        >
          <Text style={{ fontSize: 96 }}>{consecutiveDays - 1}</Text>
        </Animated.View>

        <Animated.View
          style={{
            opacity: currentNumberOpacity,
            transform: [{ translateY: currentNUmberTranslateY }],
          }}
        >
          <Text
            style={{
              fontSize: 96,
            }}
          >
            {consecutiveDays}
          </Text>
        </Animated.View>
      </View>
      <View style={{ marginBottom: 12 }}>
        <Text>consecutive day{consecutiveDays === 1 ? '' : 's'}.</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 6,
        }}
      >
        {days.map((streakDay, index) => {
          const last = isLastChecked(index, days);
          return (
            <Animated.View
              key={streakDay.day}
              style={[
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 32,
                  backgroundColor: streakDay.checked
                    ? theme.colors.primary
                    : theme.colors.tertiary,
                },
                last
                  ? {
                      width: 42,
                      height: 42,
                      transform: [{ scale: dayScale }],
                    }
                  : {},
              ]}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: streakDay.checked
                    ? theme.colors.onPrimary
                    : theme.colors.onTertiary,
                }}
              >
                {dayToString(streakDay.day)}
              </Text>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};
