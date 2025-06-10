import { Auth } from '@aws-amplify/auth';
import { getUserStaticMetadata } from '@vocably/api';
import { get } from 'lodash-es';

export const getMaxCards = async (): Promise<number | 'unlimited'> => {
  const user = await Auth.currentAuthenticatedUser().catch(() => false);

  if (!user) {
    return 'unlimited';
  }

  const isPaid = get(
    user,
    'signInUserSession.accessToken.payload.cognito:groups',
    []
  ).includes('paid');

  if (isPaid) {
    return 'unlimited';
  }

  const staticMetadataResult = await getUserStaticMetadata();

  if (staticMetadataResult.success === false) {
    return 'unlimited';
  }

  if (staticMetadataResult.value.premium) {
    return 'unlimited';
  }

  return staticMetadataResult.value.max_cards;
};
