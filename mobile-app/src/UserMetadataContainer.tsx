import {
  getUserMetadata as apiGetUserMetadata,
  saveUserMetadata as apiSaveUserMetadata,
} from '@vocably/api';
import {
  defaultUserMetadata,
  PartialUserMetadata,
  UserMetadata,
} from '@vocably/model';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { AppState } from 'react-native';
import { Loader } from './loaders/Loader';
import { retry } from './retry';

type UserMetadataContextValues = {
  userMetadata: UserMetadata;
  updateUserMetadata: (metadata: PartialUserMetadata) => Promise<void>;
};

export const UserMetadataContext = createContext<UserMetadataContextValues>({
  userMetadata: defaultUserMetadata,
  updateUserMetadata: () => Promise.resolve(),
});

type UserMetadataContainer = FC<{
  children: ReactNode;
}>;

export const UserMetadataContainer: UserMetadataContainer = ({ children }) => {
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);

  useEffect(() => {
    retry(() => apiGetUserMetadata()).then((result) => {
      if (result.success === true) {
        setUserMetadata(result.value);
      }
    });
  }, []);

  useEffect(() => {
    const onAppChangeListener = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (nextAppState !== 'active') {
          return;
        }

        retry(() => apiGetUserMetadata()).then((result) => {
          if (result.success === true) {
            setUserMetadata(result.value);
          }
        });
      }
    );

    return () => {
      onAppChangeListener.remove();
    };
  }, []);

  const updateUserMetadata = useCallback(
    async (metadata: PartialUserMetadata) => {
      const saveUserMetadataResult = await apiSaveUserMetadata(metadata);

      if (saveUserMetadataResult.success === true) {
        setUserMetadata(saveUserMetadataResult.value);
      }
    },
    [setUserMetadata]
  );

  if (userMetadata === null) {
    return <Loader>Loading user metadata...</Loader>;
  }

  return (
    <UserMetadataContext.Provider value={{ userMetadata, updateUserMetadata }}>
      {children}
    </UserMetadataContext.Provider>
  );
};
