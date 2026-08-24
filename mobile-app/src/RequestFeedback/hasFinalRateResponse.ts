import { UserMetadata } from '@vocably/model';
import { mobilePlatform } from '../mobilePlatform';

// The user has either already rated the app or asked to never be bothered again.
export const hasFinalRateResponse = (userMetadata: UserMetadata): boolean => {
  const rateResponse = userMetadata.rate[mobilePlatform];

  return (
    rateResponse?.response === 'never' || rateResponse?.response === 'review'
  );
};
