import React, { FC, useContext, useEffect, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { isOkayToAskOnStudyCompleted } from './RequestFeedback/isOkayToAskOnStudyCompleted';
import { RequestFeedbackSlideDown } from './RequestFeedback/RequestFeedbackSlideDown';
import { UserMetadataContext } from './UserMetadataContainer';

type Props = {
  style?: StyleProp<ViewStyle>;
  numberOfStudySessions?: number;
};

export const RequestFeedback: FC<Props> = ({
  style,
  numberOfStudySessions,
}) => {
  const { userMetadata } = useContext(UserMetadataContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log(numberOfStudySessions);
    if (!numberOfStudySessions) {
      return;
    }

    isOkayToAskOnStudyCompleted({
      userMetadata,
      numberOfStudySessions,
    }).then((isOkay) => {
      console.log('isOkay', isOkay, userMetadata, numberOfStudySessions);
      if (isOkay) {
        setIsVisible(true);
      }
    });
  }, []);

  return (
    <RequestFeedbackSlideDown
      style={style}
      visible={isVisible}
      source={'study'}
    />
  );
};
