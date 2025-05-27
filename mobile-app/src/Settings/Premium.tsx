import { FC } from 'react';
import { Linking, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { CustomerInfo } from 'react-native-purchases';

type Props = {
  customerInfo: CustomerInfo;
};

export const Premium: FC<Props> = ({ customerInfo }) => {
  const theme = useTheme();

  const premium = customerInfo.entitlements.active['premium'];

  const expirationDate = new Date(
    premium.expirationDate ?? ''
  ).toLocaleDateString();

  return (
    <View style={{ gap: 4 }}>
      <Text style={{ fontSize: 16, color: theme.colors.secondary }}>
        Premium
      </Text>
      {premium.willRenew && <Text>Next payment: {expirationDate}</Text>}
      {!premium.willRenew && <Text>Valid until: {expirationDate}</Text>}
      {premium.willRenew && customerInfo.managementURL && (
        <Text
          style={{ color: theme.colors.primary }}
          onPress={() => Linking.openURL(customerInfo.managementURL ?? '')}
        >
          Manage your subscription
        </Text>
      )}
    </View>
  );
};
