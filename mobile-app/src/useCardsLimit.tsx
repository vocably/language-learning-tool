import { UserStaticMetadata } from '@vocably/model';
import { get } from 'lodash-es';
import { useContext, useEffect, useState } from 'react';
import { AuthContext, AuthStatus } from './auth/AuthContext';
import {
  CustomerInfoContext,
  CustomerInfoStatus,
} from './CustomerInfoContainer';
import { UserMetadataContext } from './UserMetadataContainer';

const isPremium = (
  authStatus: AuthStatus,
  customerInfoStatus: CustomerInfoStatus
): boolean => {
  if (
    authStatus.status === 'logged-in' &&
    (
      get(
        authStatus.session,
        'tokens.accessToken.payload.cognito:groups',
        []
      ) as string[]
    ).includes('paid')
  ) {
    return true;
  }

  if (
    customerInfoStatus.status === 'loaded' &&
    get(
      customerInfoStatus.customerInformation,
      'entitlements.active.premium',
      false
    )
  ) {
    return true;
  }

  return false;
};

const getCardsLimit = (
  userStaticMetadata: UserStaticMetadata,
  authStatus: AuthStatus,
  customerInfoStatus: CustomerInfoStatus
): number | 'unlimited' => {
  if (isPremium(authStatus, customerInfoStatus)) {
    return 'unlimited';
  }

  return userStaticMetadata.max_cards;
};

export const useCardsLimit = (): number | 'unlimited' => {
  const customerInfoStatus = useContext(CustomerInfoContext);
  const authStatus = useContext(AuthContext);
  const { userStaticMetadata } = useContext(UserMetadataContext);

  const [cardsLimit, setCardsLimit] = useState<number | 'unlimited'>(
    getCardsLimit(userStaticMetadata, authStatus, customerInfoStatus)
  );

  useEffect(() => {
    if (isPremium(authStatus, customerInfoStatus)) {
      setCardsLimit('unlimited');
      return;
    }

    setCardsLimit(
      getCardsLimit(userStaticMetadata, authStatus, customerInfoStatus)
    );
  }, [userStaticMetadata, authStatus, customerInfoStatus]);

  return cardsLimit;
};
