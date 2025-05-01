import { deleteUser, signOut } from '@aws-amplify/auth';
import { FC, useCallback } from 'react';
import { Alert, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { clearAll } from '../asyncAppStorage';
import { useUserEmail } from '../auth/useUserEmail';
import { CustomScrollView } from '../ui/CustomScrollView';
import { CustomSurface } from '../ui/CustomSurface';
import { ListItem } from '../ui/ListItem';
import { ScreenTitle } from '../ui/ScreenTitle';

type Props = {};

export const AccountScreen: FC<Props> = () => {
  const theme = useTheme();
  const userEmail = useUserEmail();

  const onDelete = useCallback(() => {
    Alert.alert('Delete your account?', 'This operation cannot be undone.', [
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteUser();
          await signOut();
          await clearAll();
        },
      },
      {
        text: 'Cancel',
      },
    ]);
  }, []);

  return (
    <CustomScrollView>
      <View style={{ marginBottom: 32 }}>
        <ScreenTitle
          icon="account-circle-outline"
          title="Your account"
          style={{ marginBottom: 4 }}
          subtitle={<Text>{userEmail}</Text>}
        />
      </View>

      <CustomSurface style={{ marginBottom: 16 }}>
        <ListItem
          title="Sign out"
          onPress={() => signOut()}
          leftIcon="logout"
        />
      </CustomSurface>

      <CustomSurface style={{ marginBottom: 16 }}>
        <ListItem
          title="Delete your account"
          onPress={onDelete}
          color={theme.colors.error}
          leftIcon="trash-can-outline"
        ></ListItem>
      </CustomSurface>
    </CustomScrollView>
  );
};
