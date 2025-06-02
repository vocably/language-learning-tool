import { useContext, useEffect, useState } from 'react';
import { UserMetadataContext } from './UserMetadataContainer';

const getMinutesBeforeNextTranslation = (
  lastTranslationTime: number
): number => {
  const minutesAfterLastTranslation = Math.round(
    (new Date().getTime() - lastTranslationTime) / 60_000
  );

  return Math.max(0, 60 - minutesAfterLastTranslation);
};

export const useMinutesBeforeNextTranslation = () => {
  const { userMetadata } = useContext(UserMetadataContext);

  const [minutesBeforeNextTranslations, setMinutesBeforeNextTranslation] =
    useState<number>(
      getMinutesBeforeNextTranslation(
        userMetadata.usageStats.lastLookupTimestamp
      )
    );

  useEffect(() => {
    setMinutesBeforeNextTranslation(
      getMinutesBeforeNextTranslation(
        userMetadata.usageStats.lastLookupTimestamp
      )
    );

    const intervalId = setInterval(async () => {
      setMinutesBeforeNextTranslation(
        getMinutesBeforeNextTranslation(
          userMetadata.usageStats.lastLookupTimestamp
        )
      );
    }, 60_000);

    return () => {
      clearInterval(intervalId);
    };
  }, [userMetadata.usageStats.lastLookupTimestamp]);

  return minutesBeforeNextTranslations;
};
