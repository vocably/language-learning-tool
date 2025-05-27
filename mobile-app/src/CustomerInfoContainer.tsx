import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import Purchases, { CustomerInfo } from 'react-native-purchases';
import { AuthContext } from './auth/AuthContext';

type Props = {};

type CustomerInfoStatus =
  | {
      status: 'undefined';
    }
  | {
      status: 'loaded';
      customerInformation: CustomerInfo;
    };

export const CustomerInfoContext = createContext<CustomerInfoStatus>({
  status: 'undefined',
});

export const CustomerInfoContainer: FC<PropsWithChildren<Props>> = ({
  children,
}) => {
  const authStatus = useContext(AuthContext);

  const [customerInfoStatus, setCustomerInfoStatus] =
    useState<CustomerInfoStatus>({
      status: 'undefined',
    });

  useEffect(() => {
    if (authStatus['status'] !== 'logged-in') {
      return;
    }

    const customerInfoRefreshed = (customerInfo: CustomerInfo) => {
      console.log('Customer info refreshed', customerInfo);
      setCustomerInfoStatus({
        status: 'loaded',
        customerInformation: customerInfo,
      });
    };

    Purchases.addCustomerInfoUpdateListener(customerInfoRefreshed);
    Purchases.logIn(authStatus.attributes.email).then(({ customerInfo }) => {
      console.log('Customer logged in', customerInfo);
      setCustomerInfoStatus({
        status: 'loaded',
        customerInformation: customerInfo,
      });
    });

    return () => {
      Purchases.removeCustomerInfoUpdateListener(customerInfoRefreshed);
    };
  }, [authStatus]);

  return (
    <CustomerInfoContext.Provider value={customerInfoStatus}>
      {children}
    </CustomerInfoContext.Provider>
  );
};
