import { deleteUser, signOut } from '@aws-amplify/auth';
import { FC, useCallback } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { List, Surface, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { clearAll } from '../asyncAppStorage';
import { useUserEmail } from '../auth/useUserEmail';
import { mainPadding } from '../styles';

const styles = StyleSheet.create({
  surface: {
    padding: 8,
    borderRadius: 16,
  },
});

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
      <View
        style={{
          marginBottom: 32,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Icon name="account-circle-outline" size={24} />
        <View>
          <Text style={{ fontSize: 24, color: theme.colors.secondary }}>
            Your account
          </Text>
          <Text>{userEmail}</Text>
        </View>
      </View>

      <Surface style={[styles.surface, { marginBottom: 16 }]}>
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
      </Surface>

      <Surface style={[styles.surface, { marginBottom: 16 }]}>
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
      </Surface>
    </View>
  );
};
