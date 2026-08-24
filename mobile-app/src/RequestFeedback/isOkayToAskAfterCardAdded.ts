import { UserMetadata } from '@vocably/model';
import { hasFinalRateResponse } from './hasFinalRateResponse';

type Payload = {
  userMetadata: UserMetadata;
  numberOfCards: number;
};

export const isOkayToAskAfterCardAdded = ({
  userMetadata,
  numberOfCards,
}: Payload): boolean => {
  if (hasFinalRateResponse(userMetadata)) {
    return false;
  }

  return numberOfCards % 10 === 0;
};
