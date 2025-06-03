import React, { FC, PropsWithChildren, useContext } from 'react';
import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShareMenuReactView } from 'react-native-share-menu';
import { AuthContext } from '../auth/AuthContext';
import { Loader } from '../loaders/Loader';
import { ScreenLayout } from '../ui/ScreenLayout';

export const IosLogin: FC<PropsWithChildren> = ({ children }) => {
  const authStatus = useContext(AuthContext);
  const insets = useSafeAreaInsets();

  if (authStatus.status === 'undefined') {
    return <Loader>Authenticating...</Loader>;
  }

  if (authStatus.status === 'logged-in') {
    return <>{children}</>;
  }

  return (
    <ScreenLayout
      header={
        <View
          style={{
            paddingTop: insets.top,
            paddingLeft: insets.left + 16,
            paddingRight: insets.right + 16,
          }}
        >
          <IconButton
            icon={'close'}
            onPress={() => ShareMenuReactView.dismissExtension()}
            style={{ alignSelf: 'flex-end' }}
          />
        </View>
      }
      content={
        <View
          style={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
            gap: 8,
          }}
        >
          <Text variant="bodyLarge">You are not signed in.</Text>
          <Text variant="bodyLarge">Open Vocably to sign in.</Text>
        </View>
      }
    ></ScreenLayout>
  );
};
