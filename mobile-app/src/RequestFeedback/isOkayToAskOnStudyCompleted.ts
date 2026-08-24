import { UserMetadata } from '@vocably/model';
import { hasFinalRateResponse } from './hasFinalRateResponse';

type Payload = {
  userMetadata: UserMetadata;
  numberOfStudySessions: number;
};

export const isOkayToAskOnStudyCompleted = async ({
  userMetadata,
  numberOfStudySessions,
}: Payload): Promise<boolean> => {
  if (numberOfStudySessions === 0) {
    return false;
  }

  if (hasFinalRateResponse(userMetadata)) {
    return false;
  }

  return numberOfStudySessions % 5 === 0;
};
