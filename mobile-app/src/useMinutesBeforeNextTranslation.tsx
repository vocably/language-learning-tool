import { UsageStats } from '@vocably/model';
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

const getMinutesBeforeNextTranslation = (
  usageStats: UsageStats,
  authStatus: AuthStatus,
  customerInfoStatus: CustomerInfoStatus
): number => {
  if (usageStats.totalLookups < 50) {
    return 0;
  }

  if (isPremium(authStatus, customerInfoStatus)) {
    return 0;
  }

  const minutesAfterLastTranslation = Math.round(
    (new Date().getTime() - usageStats.lastLookupTimestamp) / 60_000
  );

  return Math.max(0, 2 - minutesAfterLastTranslation);
};

export const useMinutesBeforeNextTranslation = () => {
  const { userMetadata } = useContext(UserMetadataContext);
  const customerInfoStatus = useContext(CustomerInfoContext);
  const authStatus = useContext(AuthContext);

  const [minutesBeforeNextTranslations, setMinutesBeforeNextTranslation] =
    useState<number>(
      getMinutesBeforeNextTranslation(
        userMetadata.usageStats,
        authStatus,
        customerInfoStatus
      )
    );

  useEffect(() => {
    if (isPremium(authStatus, customerInfoStatus)) {
      setMinutesBeforeNextTranslation(0);
      return;
    }

    setMinutesBeforeNextTranslation(
      getMinutesBeforeNextTranslation(
        userMetadata.usageStats,
        authStatus,
        customerInfoStatus
      )
    );

    const intervalId = setInterval(async () => {
      setMinutesBeforeNextTranslation(
        getMinutesBeforeNextTranslation(
          userMetadata.usageStats,
          authStatus,
          customerInfoStatus
        )
      );
    }, 60_000);

    return () => {
      clearInterval(intervalId);
    };
  }, [userMetadata.usageStats, authStatus, customerInfoStatus]);

  return minutesBeforeNextTranslations;
};
