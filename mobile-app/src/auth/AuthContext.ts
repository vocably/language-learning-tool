import { GetCurrentUserOutput } from '@aws-amplify/auth';
import { createContext } from 'react';

export type AuthStatus =
  | {
      status: 'undefined';
    }
  | {
      status: 'not-logged-in';
    }
  | {
      status: 'logged-in';
      user: GetCurrentUserOutput;
    }
  | {
      status: 'error';
      error: any;
    };

export const AuthContext = createContext<AuthStatus>({
  status: 'undefined',
});
