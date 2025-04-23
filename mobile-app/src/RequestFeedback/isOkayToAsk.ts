import { UserMetadata } from '@vocably/model';
import { Platform } from 'react-native';

type Payload = {
  userMetadata: UserMetadata;
  numberOfStudySessions: number;
};

const platform: 'ios' | 'android' = Platform.OS === 'ios' ? 'ios' : 'android';

export const isOkayToAsk = async ({
  userMetadata,
  numberOfStudySessions,
}: Payload): Promise<boolean> => {
  if (numberOfStudySessions === 0) {
    return false;
  }

  if (
    userMetadata.rate[platform] !== undefined &&
    (userMetadata.rate[platform]?.response === 'never' ||
      userMetadata.rate[platform]?.response === 'review')
  ) {
    return false;
  }

  return numberOfStudySessions % 5 === 0;
};
