import { RateInteractionPayload } from '@vocably/model';
import { usePostHog } from 'posthog-react-native';
import React, { FC, useCallback, useContext, useEffect } from 'react';
import { Linking, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { mobilePlatform, mobileStoreUrl } from './mobilePlatform';
import { isOkayToAsk } from './RequestFeedback/isOkayToAsk';
import { RequestFeedbackForm } from './RequestFeedback/RequestFeedbackForm';
import { UserMetadataContext } from './UserMetadataContainer';

type Props = {
  style?: StyleProp<ViewStyle>;
  numberOfStudySessions?: number;
};

export const RequestFeedback: FC<Props> = ({
  style,
  numberOfStudySessions,
}) => {
  const askForReviewMaxHeight = useSharedValue(0);
  const askForReviewOpacity = useSharedValue(0);

  const { userMetadata, updateUserMetadata } = useContext(UserMetadataContext);

  const askForReviewAnimatedStyles = useAnimatedStyle(() => {
    return {
      maxHeight: askForReviewMaxHeight.value,
      opacity: askForReviewOpacity.value,
    };
  });

  const posthog = usePostHog();

  useEffect(() => {
    if (!numberOfStudySessions) {
      return;
    }

    isOkayToAsk({
      userMetadata,
      numberOfStudySessions,
    }).then((isOkay) => {
      if (isOkay) {
        posthog.capture('feedback-requested');
        askForReviewMaxHeight.value = 1000;
        askForReviewOpacity.value = withTiming(1);
      }
    });
  }, []);

  const onRequestFeedbackAction = useCallback(
    (choice: RateInteractionPayload) => {
      posthog.capture('feedback-responded', {
        choice,
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
