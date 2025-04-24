import { deleteUser, signOut } from '@aws-amplify/auth';
import { FC, useCallback } from 'react';
import { Alert, View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { clearAll } from '../asyncAppStorage';
import { useUserEmail } from '../auth/useUserEmail';
import { mainPadding } from '../styles';
import { CustomSurface } from '../ui/CustomSurface';
import { ScreenTitle } from '../ui/ScreenTitle';

type Props = {};

export const AccountScreen: FC<Props> = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
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
    <View
      style={{
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        paddingLeft: insets.left + mainPadding,
        paddingRight: insets.right + mainPadding,
        paddingBottom: insets.bottom + mainPadding,
        paddingTop: mainPadding,
      }}
    >
      <View style={{ marginBottom: 32 }}>
        <ScreenTitle
          icon="account-circle-outline"
          title="Your account"
          style={{ marginBottom: 4 }}
        />
        <Text>{userEmail}</Text>
      </View>

      <CustomSurface style={{ marginBottom: 16 }}>
        <List.Item
          title="Sign out"
          onPress={() => signOut()}
          titleStyle={{
            color: theme.colors.onBackground,
          }}
          left={() => (
            <Icon
              name="logout"
              size={24}
              color={theme.colors.onBackground}
              style={{ marginLeft: 16 }}
            />
          )}
        ></List.Item>
      </CustomSurface>

      <CustomSurface style={{ marginBottom: 16 }}>
        <List.Item
          title="Delete your account"
          onPress={onDelete}
          titleStyle={{
            color: theme.colors.error,
          }}
          left={() => (
            <Icon
              name="trash-can-outline"
              size={24}
              color={theme.colors.error}
              style={{ marginLeft: 16 }}
            />
          )}
        ></List.Item>
      </CustomSurface>
    </View>
  );
};
