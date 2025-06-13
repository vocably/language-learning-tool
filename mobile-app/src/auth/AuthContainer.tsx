import { postOnboardingAction } from '@vocably/api';
import { Result } from '@vocably/model';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { usePostHog } from 'posthog-react-native';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import Purchases from 'react-native-purchases';
import { Sentry } from '../BetterSentry';
import { facility } from '../facility';
import { notificationsIdentifyUser } from '../notificationsIdentifyUser';
import { retry } from '../retry';
import { AuthContext, AuthStatus } from './AuthContext';
import { getFlatAttributes } from './getFlatAttributes';

const getAttributes = async (): Promise<
  Result<{
    sub: string;
    email: string;
  }>
> => {
  try {
    const flatAttributes = await getFlatAttributes();

    if (!flatAttributes || !flatAttributes['sub'] || !flatAttributes['email']) {
      return {
        success: false,
        errorCode: 'FUCKING_ERROR',
        reason: 'The flat attributes have no sufficient data',
        extra: flatAttributes,
      };
    }

    const { customerInfo } = await Purchases.logIn(flatAttributes['email']);

    return {
      success: true,
      value: {
        sub: flatAttributes.sub,
        email: flatAttributes.email,
      },
    };
  } catch (error) {
    return {
      success: false,
      errorCode: 'FUCKING_ERROR',
      reason: 'Unable to get flat attributes.',
      extra: error,
    };
  }
};

export const AuthContainer: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    status: 'undefined',
  });

  const posthog = usePostHog();

  useEffect(() => {
    if (authStatus.status !== 'logged-in') {
      return;
    }

    posthog.identify(authStatus.attributes['sub'], {
      email: authStatus.attributes['email'],
    });
  }, [authStatus]);

  useEffect(() => {
    retry(
      () =>
        fetchAuthSession().then(async (session) => {
          if (!session.tokens) {
            throw new Error('The fetched session has no access tokens.');
          }

          const attributesResult = await getAttributes();

          if (attributesResult.success === false) {
            throw new Error(
              'Unable to get attributes (getAttributes) method is failing.'
            );
          }

          setAuthStatus({
            status: 'logged-in',
            session,
            attributes: attributesResult.value,
          });
        }),
      3,
      200
    ).catch((error) => {
      console.error('Unable to authenticate', error);
      setAuthStatus({
        status: 'not-logged-in',
      });
    });

    return Hub.listen('auth', (event) => {
      if (event.payload.event === 'tokenRefresh_failure') {
        posthog.capture('tokenRefreshFailure', { ...event.payload });
        //@ts-ignore
        Sentry.captureMessage('tokenRefreshFailure', { ...event.payload });
      }

      if (event.payload.event === 'signedOut') {
        setAuthStatus({
          status: 'not-logged-in',
        });
        return;
      }

      if (event.payload.event === 'signedIn') {
        notificationsIdentifyUser();

        fetchAuthSession()
          .then(async (session) => {
            if (!session.tokens) {
              throw new Error('The fetched session has no access tokens.');
            }

            const attributesResult = await getAttributes();

            if (attributesResult.success === false) {
              throw new Error(
                'Unable to get attributes (getAttributes) method is failing.'
              );
            }
            setAuthStatus({
              status: 'logged-in',
              session,
              attributes: attributesResult.value,
            });

            postOnboardingAction({
              name: 'userLoggedIn',
              payload: {
                facility,
              },
            }).then();
          })
          .catch((error) => {
            setAuthStatus({
              status: 'error',
              error,
            });
          });
        return;
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={authStatus}>{children}</AuthContext.Provider>
  );
};
