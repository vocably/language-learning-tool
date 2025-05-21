import { postOnboardingAction } from '@vocably/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { usePostHog } from 'posthog-react-native';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { Sentry } from '../BetterSentry';
import { facility } from '../facility';
import { notificationsIdentifyUser } from '../notificationsIdentifyUser';
import { AuthContext, AuthStatus } from './AuthContext';
import { getFlatAttributes } from './getFlatAttributes';

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

    getFlatAttributes().then(async (attributes) => {
      if (!attributes) {
        return;
      }

      if (!attributes['sub'] || !attributes['email']) {
        return;
      }

      posthog.identify(attributes['sub'], {
        email: attributes['email'],
      });
    });
  }, [authStatus]);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setAuthStatus({
          status: 'logged-in',
          user,
        });
      })
      .catch((error) => {
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

        getCurrentUser()
          .then(async (user) => {
            setAuthStatus({
              status: 'logged-in',
              user,
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
