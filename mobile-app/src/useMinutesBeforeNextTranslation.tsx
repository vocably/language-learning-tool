import { get } from 'lodash-es';
import { useContext, useEffect, useState } from 'react';
import { AuthContext, AuthStatus } from './auth/AuthContext';
import { UserMetadataContext } from './UserMetadataContainer';

const getMinutesBeforeNextTranslation = (
  lastTranslationTime: number,
  authStatus: AuthStatus
): number => {
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
    return 0;
  }

  const minutesAfterLastTranslation = Math.round(
    (new Date().getTime() - lastTranslationTime) / 60_000
  );

  return Math.max(0, 2 - minutesAfterLastTranslation);
};

export const useMinutesBeforeNextTranslation = () => {
  const { userMetadata } = useContext(UserMetadataContext);
  const authStatus = useContext(AuthContext);

  const [minutesBeforeNextTranslations, setMinutesBeforeNextTranslation] =
    useState<number>(
      getMinutesBeforeNextTranslation(
        userMetadata.usageStats.lastLookupTimestamp,
        authStatus
      )
    );

  useEffect(() => {
    setMinutesBeforeNextTranslation(
      getMinutesBeforeNextTranslation(
        userMetadata.usageStats.lastLookupTimestamp,
        authStatus
      )
    );

    const intervalId = setInterval(async () => {
      setMinutesBeforeNextTranslation(
        getMinutesBeforeNextTranslation(
          userMetadata.usageStats.lastLookupTimestamp,
          authStatus
        )
      );
    }, 60_000);

    return () => {
      clearInterval(intervalId);
    };
  }, [userMetadata.usageStats.lastLookupTimestamp, authStatus]);

  return minutesBeforeNextTranslations;
};
