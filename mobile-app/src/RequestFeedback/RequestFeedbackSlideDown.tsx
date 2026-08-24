import { RateInteractionPayload } from '@vocably/model';
import { usePostHog } from 'posthog-react-native';
import React, { FC, useCallback, useContext, useEffect } from 'react';
import { Linking, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { mobilePlatform, mobileStoreUrl } from '../mobilePlatform';
import { UserMetadataContext } from '../UserMetadataContainer';
import { RequestFeedbackForm } from './RequestFeedbackForm';

type Props = {
  style?: StyleProp<ViewStyle>;
  // Slides the form down as soon as it becomes true.
  visible: boolean;
  // Which part of the app has asked for the feedback. Analytics only.
  source: string;
};

export const RequestFeedbackSlideDown: FC<Props> = ({
  style,
  visible,
  source,
}) => {
  const askForReviewMaxHeight = useSharedValue(0);
  const askForReviewOpacity = useSharedValue(0);

  const { updateUserMetadata } = useContext(UserMetadataContext);

  const askForReviewAnimatedStyles = useAnimatedStyle(() => {
    return {
      maxHeight: askForReviewMaxHeight.value,
      opacity: askForReviewOpacity.value,
    };
  });

  const posthog = usePostHog();

  useEffect(() => {
    if (!visible) {
      return;
    }

    posthog.capture('feedback-requested', { source });
    askForReviewMaxHeight.value = 1000;
    askForReviewOpacity.value = withTiming(1);
  }, [visible]);

  const onRequestFeedbackAction = useCallback(
    (choice: RateInteractionPayload) => {
      posthog.capture('feedback-responded', {
        choice,
        source,
      });

      if (choice === 'later' || choice === 'never') {
        askForReviewOpacity.value = withTiming(0);
        askForReviewMaxHeight.value = withTiming(0);
      }

      if (choice === 'review') {
        Linking.openURL(mobileStoreUrl).then();
      }

      updateUserMetadata({
        rate: {
          [mobilePlatform]: {
            response: choice,
            isoDate: new Date().toISOString(),
          },
        },
      }).then();
    },
    [updateUserMetadata]
  );

  return (
    <Animated.View
      style={[
        askForReviewAnimatedStyles,
        style,
        {
          overflow: 'hidden',
        },
      ]}
    >
      <RequestFeedbackForm
        onAction={onRequestFeedbackAction}
      ></RequestFeedbackForm>
    </Animated.View>
  );
};
