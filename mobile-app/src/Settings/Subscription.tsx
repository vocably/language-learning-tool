import { FC, useContext } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { CustomerInfo } from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomerInfoContext } from '../CustomerInfoContainer';
import { InlineLoader } from '../loaders/InlineLoader';
import { CustomSurface } from '../ui/CustomSurface';
import { ListItem } from '../ui/ListItem';
import { Premium } from './Premium';

type Props = {
  style?: StyleProp<ViewStyle>;
};

const isPremium = (customerInfo: CustomerInfo): boolean => {
  return customerInfo.entitlements.active['premium'] !== undefined;
};

export const Subscription: FC<Props> = ({ style }) => {
  const theme = useTheme();

  const customerInfoStatus = useContext(CustomerInfoContext);

  console.log(customerInfoStatus);

  async function presentPaywall(): Promise<boolean> {
    // Present paywall for current offering:
    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall();

    switch (paywallResult) {
      case PAYWALL_RESULT.NOT_PRESENTED:
      case PAYWALL_RESULT.ERROR:
      case PAYWALL_RESULT.CANCELLED:
        return false;
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        return true;
      default:
        return false;
    }
  }

  return (
    <CustomSurface style={style}>
      {customerInfoStatus.status === 'undefined' && (
        <View style={{ padding: 16 }}>
          <InlineLoader center={false}>Loading customer status</InlineLoader>
        </View>
      )}
      {customerInfoStatus.status === 'loaded' && (
        <>
          {isPremium(customerInfoStatus.customerInformation) && (
            <View style={{ padding: 16 }}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 16,
                  alignItems: 'center',
                }}
              >
                <Icon
                  name={'crown-outline'}
                  size={24}
                  color={theme.colors.onSurface}
                />
                <Premium
                  customerInfo={customerInfoStatus.customerInformation}
                />
              </View>
            </View>
          )}
          {!isPremium(customerInfoStatus.customerInformation) && (
            <ListItem
              leftIcon="crown-outline"
              rightIcon=""
              title="Subscribe"
              onPress={() => presentPaywall()}
            />
          )}
        </>
      )}
    </CustomSurface>
  );
};
